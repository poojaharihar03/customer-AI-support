import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Progress from '../../../../lib/models/Progress';
import InterviewSession from '../../../../lib/models/InterviewSession';
import { rateLimit, getCachedResponse, setCachedResponse, generateCacheKey } from '../../../../lib/rateLimit';
import { successResponse, errorResponse, getVisitorId } from '../../../../lib/apiUtils';

// GET - Fetch progress data
export async function GET(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 30);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    const cacheKey = generateCacheKey('progress', { visitorId });
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return NextResponse.json(successResponse(cached, 'Progress retrieved from cache'));
    }

    await dbConnect();

    let progress = await Progress.findOne({ visitorId }).lean();
    
    if (!progress) {
      // Return default progress for new users
      progress = generateDefaultProgress(visitorId);
    }

    // Get recent sessions
    const recentSessions = await InterviewSession.find({ visitorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const result = {
      overallProgress: {
        totalSessions: progress.totalSessions || 0,
        totalHours: Math.round((progress.totalPracticeTime || 0) / 60),
        averageScore: progress.averageScore || 0,
        streak: progress.currentStreak || 0
      },
      monthlyScores: progress.monthlyScores || generateDefaultMonthlyScores(),
      recentSessions: recentSessions.map(s => ({
        id: s._id,
        type: formatRoundType(s.roundType),
        date: s.createdAt,
        score: s.completionRate,
        duration: Math.round(s.timeUsed / 60)
      })),
      skillBreakdown: formatSkillBreakdown(progress.skillScores),
      weaknesses: progress.weaknesses || [
        { area: 'System Design Scalability', score: 55, trend: 'improving' },
        { area: 'Database Optimization', score: 58, trend: 'stable' },
        { area: 'Distributed Systems', score: 52, trend: 'improving' }
      ],
      strengths: progress.strengths || [
        { area: 'Communication Skills', score: 70, trend: 'stable' },
        { area: 'Problem Decomposition', score: 65, trend: 'improving' },
        { area: 'Code Clarity', score: 68, trend: 'improving' }
      ],
      feedbackHistory: progress.feedbackHistory || []
    };

    setCachedResponse(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes

    return NextResponse.json(successResponse(result, 'Progress retrieved'));
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(errorResponse('Failed to fetch progress', 500), { status: 500 });
  }
}

// POST - Save feedback entry
export async function POST(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 15);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    await dbConnect();

    const body = await req.json();
    const { question, response, scores, overallScore } = body;

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

    // Add feedback entry
    progress.feedbackHistory.push({
      question,
      response,
      scores,
      overallScore,
      createdAt: new Date()
    });

    // Keep only last 50 feedback entries
    if (progress.feedbackHistory.length > 50) {
      progress.feedbackHistory = progress.feedbackHistory.slice(-50);
    }

    // Update skill scores based on feedback
    updateSkillScores(progress, scores);

    await progress.save();

    // Clear cache
    const cacheKey = generateCacheKey('progress', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(successResponse(progress, 'Feedback saved'), { status: 201 });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(errorResponse('Failed to save feedback', 500), { status: 500 });
  }
}

// Helper functions
function generateDefaultProgress(visitorId) {
  return {
    visitorId,
    totalSessions: 0,
    totalPracticeTime: 0,
    averageScore: 0,
    currentStreak: 0,
    skillScores: [
      { skill: 'Problem Solving', score: 50 },
      { skill: 'Communication', score: 50 },
      { skill: 'Technical Knowledge', score: 50 },
      { skill: 'System Design', score: 50 },
      { skill: 'Code Quality', score: 50 },
      { skill: 'Time Management', score: 50 }
    ],
    monthlyScores: generateDefaultMonthlyScores(),
    feedbackHistory: [],
    strengths: [],
    weaknesses: []
  };
}

function generateDefaultMonthlyScores() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      behavioral: 0,
      technical: 0,
      systemDesign: 0
    });
  }
  return months;
}

function formatRoundType(type) {
  const types = {
    behavioral: 'Behavioral',
    technical: 'Technical',
    systemDesign: 'System Design'
  };
  return types[type] || type;
}

function formatSkillBreakdown(skillScores) {
  if (!skillScores || skillScores.length === 0) {
    return {
      'Problem Solving': 50,
      'Communication': 50,
      'Technical Knowledge': 50,
      'System Design': 50,
      'Code Quality': 50,
      'Time Management': 50
    };
  }
  
  const breakdown = {};
  skillScores.forEach(s => {
    breakdown[s.skill] = s.score;
  });
  return breakdown;
}

function updateSkillScores(progress, scores) {
  const skillMap = {
    clarity: 'Communication',
    relevance: 'Problem Solving',
    depth: 'Technical Knowledge',
    examples: 'Code Quality',
    communication: 'Communication'
  };

  Object.entries(scores).forEach(([key, score]) => {
    const skillName = skillMap[key];
    if (skillName) {
      const skillEntry = progress.skillScores.find(s => s.skill === skillName);
      if (skillEntry) {
        // Weighted average: 70% existing, 30% new
        skillEntry.score = Math.round(skillEntry.score * 0.7 + score * 0.3);
        skillEntry.updatedAt = new Date();
      }
    }
  });
}
