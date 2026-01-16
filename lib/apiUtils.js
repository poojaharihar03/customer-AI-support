/**
 * Standard API response wrapper
 */
export function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

export function errorResponse(message = 'An error occurred', statusCode = 500, details = null) {
  return {
    success: false,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * API route handler wrapper with error handling
 */
export function withErrorHandler(handler) {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      return new Response(
        JSON.stringify(errorResponse(message, statusCode)),
        {
          status: statusCode,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(', ')}`
    };
  }
}

/**
 * Get visitor ID from request (cookies, headers, or generate new)
 */
export function getVisitorId(req) {
  // Check for visitor ID in various places
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').filter(Boolean).map(c => c.split('='))
  );
  
  return cookies.visitorId || 
         req.headers.get('x-visitor-id') || 
         `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
