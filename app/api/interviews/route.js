import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import InterviewSession from '../../../../lib/models/InterviewSession';
import Progress from '../../../../lib/models/Progress';
import { rateLimit, getCachedResponse, setCachedResponse, generateCacheKey } from '../../../../lib/rateLimit';
import { successResponse, errorResponse, getVisitorId } from '../../../../lib/apiUtils';

// GET - Fetch interview sessions
export async function GET(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 30);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    const cacheKey = generateCacheKey('interviews', { visitorId });
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return NextResponse.json(successResponse(cached, 'Sessions retrieved from cache'));
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const roundType = searchParams.get('roundType');

    const query = { visitorId };
    if (roundType) query.roundType = roundType;

    const sessions = await InterviewSession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const stats = await InterviewSession.aggregate([
      { $match: { visitorId } },
      {
        $group: {
          _id: '$roundType',
          totalSessions: { $sum: 1 },
          avgScore: { $avg: '$completionRate' },
          totalTime: { $sum: '$timeUsed' }
        }
      }
    ]);

    const result = { sessions, stats };
    setCachedResponse(cacheKey, result);

    return NextResponse.json(successResponse(result, 'Interview sessions retrieved'));
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return NextResponse.json(errorResponse('Failed to fetch sessions', 500), { status: 500 });
  }
}

// POST - Save interview session
export async function POST(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 15);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    await dbConnect();

    const body = await req.json();
    const {
      roundType,
      totalQuestions,
      answeredQuestions,
      timeUsed,
      completionRate,
      averageTimePerQuestion,
      answers
    } = body;

    // Create interview session
    const session = new InterviewSession({
      visitorId,
      roundType,
      totalQuestions,
      answeredQuestions,
      timeUsed,
      completionRate,
      averageTimePerQuestion,
      answers
    });
    await session.save();

    // Update progress
    await updateProgress(visitorId, session);

    // Clear cache
    const cacheKey = generateCacheKey('interviews', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(successResponse(session, 'Interview session saved'), { status: 201 });
  } catch (error) {
    console.error('Error saving interview session:', error);
    return NextResponse.json(errorResponse('Failed to save session', 500), { status: 500 });
  }
}

// Helper function to update progress
async function updateProgress(visitorId, session) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let progress = await Progress.findOne({ visitorId });
  
  if (!progress) {
    progress = new Progress({
      visitorId,
      skillScores: [
        { skill: 'Problem Solving', score: 50 },
        { skill: 'Communication', score: 50 },
        { skill: 'Technical Knowledge', score: 50 },
        { skill: 'System Design', score: 50 },
        { skill: 'Code Quality', score: 50 },
        { skill: 'Time Management', score: 50 }
      ]
    });
  }

  // Update total sessions and time
  progress.totalSessions += 1;
  progress.totalPracticeTime += Math.ceil(session.timeUsed / 60);

  // Update streak
  const lastPractice = progress.lastPracticeDate ? new Date(progress.lastPracticeDate) : null;
  if (lastPractice) {
    lastPractice.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      progress.currentStreak += 1;
    } else if (dayDiff > 1) {
      progress.currentStreak = 1;
    }
  } else {
    progress.currentStreak = 1;
  }
  progress.lastPracticeDate = new Date();

  // Update average score
  const allSessions = await InterviewSession.find({ visitorId });
  const totalScore = allSessions.reduce((sum, s) => sum + s.completionRate, 0);
  progress.averageScore = Math.round(totalScore / allSessions.length);

  // Update monthly scores
  const monthName = today.toLocaleDateString('en-US', { month: 'short' });
  const year = today.getFullYear();
  
  let monthlyEntry = progress.monthlyScores.find(
    m => m.month === monthName && m.year === year
  );
  
  if (!monthlyEntry) {
    monthlyEntry = { month: monthName, year, behavioral: 0, technical: 0, systemDesign: 0 };
    progress.monthlyScores.push(monthlyEntry);
  }
  
  const fieldMap = {
    behavioral: 'behavioral',
    technical: 'technical',
    systemDesign: 'systemDesign'
  };
  
  if (fieldMap[session.roundType]) {
    const idx = progress.monthlyScores.findIndex(
      m => m.month === monthName && m.year === year
    );
    if (idx !== -1) {
      const currentScore = progress.monthlyScores[idx][fieldMap[session.roundType]] || 0;
      progress.monthlyScores[idx][fieldMap[session.roundType]] = Math.round(
        (currentScore + session.completionRate) / 2
      );
    }
  }

  await progress.save();
}
