import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Conversation from '../../../../lib/models/Conversation';
import { rateLimit, getCachedResponse, setCachedResponse, generateCacheKey } from '../../../../lib/rateLimit';
import { successResponse, errorResponse, withErrorHandler, getVisitorId } from '../../../../lib/apiUtils';

// GET - Fetch conversations for a visitor
export async function GET(req) {
  try {
    const visitorId = getVisitorId(req);
    
    // Rate limiting
    const rateLimitResult = rateLimit(visitorId, 30);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        errorResponse('Rate limit exceeded', 429),
        { status: 429 }
      );
    }

    // Check cache
    const cacheKey = generateCacheKey('conversations', { visitorId });
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return NextResponse.json(successResponse(cached, 'Conversations retrieved from cache'));
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({ visitorId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Conversation.countDocuments({ visitorId });

    const result = {
      conversations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    // Cache the result
    setCachedResponse(cacheKey, result);

    return NextResponse.json(successResponse(result, 'Conversations retrieved successfully'));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch conversations', 500),
      { status: 500 }
    );
  }
}

// POST - Create new conversation or add message
export async function POST(req) {
  try {
    const visitorId = getVisitorId(req);
    
    // Rate limiting
    const rateLimitResult = rateLimit(visitorId, 20);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        errorResponse('Rate limit exceeded', 429),
        { status: 429 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { conversationId, message, title, category } = body;

    let conversation;

    if (conversationId) {
      // Add message to existing conversation
      conversation = await Conversation.findOneAndUpdate(
        { _id: conversationId, visitorId },
        {
          $push: { messages: message },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );

      if (!conversation) {
        return NextResponse.json(
          errorResponse('Conversation not found', 404),
          { status: 404 }
        );
      }
    } else {
      // Create new conversation
      conversation = new Conversation({
        visitorId,
        title: title || 'New Conversation',
        category: category || 'general',
        messages: message ? [message] : []
      });
      await conversation.save();
    }

    // Clear cache for this visitor
    const cacheKey = generateCacheKey('conversations', { visitorId });
    setCachedResponse(cacheKey, null);

    return NextResponse.json(
      successResponse(conversation, conversationId ? 'Message added' : 'Conversation created'),
      { status: conversationId ? 200 : 201 }
    );
  } catch (error) {
    console.error('Error creating/updating conversation:', error);
    return NextResponse.json(
      errorResponse('Failed to save conversation', 500),
      { status: 500 }
    );
  }
}

// DELETE - Delete a conversation
export async function DELETE(req) {
  try {
    const visitorId = getVisitorId(req);
    
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json(
        errorResponse('Conversation ID required', 400),
        { status: 400 }
      );
    }

    const result = await Conversation.findOneAndDelete({
      _id: conversationId,
      visitorId
    });

    if (!result) {
      return NextResponse.json(
        errorResponse('Conversation not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(null, 'Conversation deleted'));
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      errorResponse('Failed to delete conversation', 500),
      { status: 500 }
    );
  }
}
