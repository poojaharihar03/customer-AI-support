import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import ScheduledInterview from '../../../../lib/models/ScheduledInterview';
import { rateLimit, getCachedResponse, setCachedResponse, generateCacheKey } from '../../../../lib/rateLimit';
import { successResponse, errorResponse, getVisitorId } from '../../../../lib/apiUtils';

const prepTaskTemplates = {
  'phone': [
    { task: 'Research company background', duration: 30 },
    { task: 'Prepare elevator pitch', duration: 15 },
    { task: 'Review role requirements', duration: 20 },
    { task: 'Prepare questions for interviewer', duration: 15 }
  ],
  'technical': [
    { task: 'Review data structures', duration: 60 },
    { task: 'Practice coding problems', duration: 90 },
    { task: 'Review algorithms complexity', duration: 45 },
    { task: 'Mock coding session', duration: 60 }
  ],
  'behavioral': [
    { task: 'Prepare STAR stories', duration: 45 },
    { task: 'Review company values', duration: 20 },
    { task: 'Practice common questions', duration: 30 },
    { task: 'Mock behavioral interview', duration: 45 }
  ],
  'system-design': [
    { task: 'Review design patterns', duration: 60 },
    { task: 'Study scalability concepts', duration: 45 },
    { task: 'Practice drawing diagrams', duration: 30 },
    { task: 'Mock design session', duration: 60 }
  ],
  'onsite': [
    { task: 'Full technical prep review', duration: 120 },
    { task: 'Behavioral story preparation', duration: 60 },
    { task: 'System design practice', duration: 90 },
    { task: 'Rest and mental preparation', duration: 60 }
  ],
  'hr': [
    { task: 'Research salary ranges', duration: 30 },
    { task: 'Prepare negotiation points', duration: 20 },
    { task: 'Review benefits questions', duration: 15 },
    { task: 'Prepare career goals discussion', duration: 20 }
  ]
};

// GET - Fetch scheduled interviews
export async function GET(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 30);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    const cacheKey = generateCacheKey('scheduler', { visitorId });
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return NextResponse.json(successResponse(cached, 'Interviews retrieved from cache'));
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    const query = { visitorId };
    if (status) query.status = status;
    if (upcoming) {
      query.date = { $gte: new Date() };
      query.status = 'upcoming';
    }

    const interviews = await ScheduledInterview.find(query)
      .sort({ date: 1 })
      .lean();

    setCachedResponse(cacheKey, interviews, 60 * 1000); // Cache for 1 minute

    return NextResponse.json(successResponse(interviews, 'Scheduled interviews retrieved'));
  } catch (error) {
    console.error('Error fetching scheduled interviews:', error);
    return NextResponse.json(errorResponse('Failed to fetch interviews', 500), { status: 500 });
  }
}

// POST - Create scheduled interview
export async function POST(req) {
  try {
    const visitorId = getVisitorId(req);
    
    const rateLimitResult = rateLimit(visitorId, 10);
    if (!rateLimitResult.success) {
      return NextResponse.json(errorResponse('Rate limit exceeded', 429), { status: 429 });
    }

    await dbConnect();

    const body = await req.json();
    const { company, role, interviewType, date, time, link, notes } = body;

    if (!company || !interviewType || !date || !time) {
      return NextResponse.json(
        errorResponse('Missing required fields: company, interviewType, date, time', 400),
        { status: 400 }
      );
    }

    // Generate prep tasks based on interview type
    const prepTasks = (prepTaskTemplates[interviewType] || []).map((t, idx) => ({
      ...t,
      completed: false
    }));

    const interview = new ScheduledInterview({
      visitorId,
      company,
      role,
      interviewType,
      date: new Date(date),
      time,
      link,
      notes,
      prepTasks
    });

    await interview.save();

    // Clear cache
    const cacheKey = generateCacheKey('scheduler', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(successResponse(interview, 'Interview scheduled'), { status: 201 });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json(errorResponse('Failed to schedule interview', 500), { status: 500 });
  }
}

// PUT - Update scheduled interview (e.g., toggle prep task)
export async function PUT(req) {
  try {
    const visitorId = getVisitorId(req);
    
    await dbConnect();

    const body = await req.json();
    const { interviewId, updates, toggleTaskIndex } = body;

    if (!interviewId) {
      return NextResponse.json(errorResponse('Interview ID required', 400), { status: 400 });
    }

    let interview = await ScheduledInterview.findOne({ _id: interviewId, visitorId });
    
    if (!interview) {
      return NextResponse.json(errorResponse('Interview not found', 404), { status: 404 });
    }

    // Toggle prep task completion
    if (typeof toggleTaskIndex === 'number') {
      if (interview.prepTasks[toggleTaskIndex]) {
        interview.prepTasks[toggleTaskIndex].completed = !interview.prepTasks[toggleTaskIndex].completed;
      }
    }

    // Apply other updates
    if (updates) {
      Object.assign(interview, updates);
    }

    await interview.save();

    // Clear cache
    const cacheKey = generateCacheKey('scheduler', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(successResponse(interview, 'Interview updated'));
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json(errorResponse('Failed to update interview', 500), { status: 500 });
  }
}

// DELETE - Delete scheduled interview
export async function DELETE(req) {
  try {
    const visitorId = getVisitorId(req);
    
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('id');

    if (!interviewId) {
      return NextResponse.json(errorResponse('Interview ID required', 400), { status: 400 });
    }

    const result = await ScheduledInterview.findOneAndDelete({
      _id: interviewId,
      visitorId
    });

    if (!result) {
      return NextResponse.json(errorResponse('Interview not found', 404), { status: 404 });
    }

    // Clear cache
    const cacheKey = generateCacheKey('scheduler', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(successResponse(null, 'Interview deleted'));
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(errorResponse('Failed to delete interview', 500), { status: 500 });
  }
}
