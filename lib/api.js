// Generate or retrieve visitor ID for anonymous users
export function getVisitorId() {
  if (typeof window === 'undefined') return null;
  
  let visitorId = localStorage.getItem('visitorId');
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitorId', visitorId);
  }
  
  return visitorId;
}

// API request wrapper with error handling
export async function apiRequest(endpoint, options = {}) {
  const visitorId = getVisitorId();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-visitor-id': visitorId
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Specific API methods
export const api = {
  // Conversations
  conversations: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/api/conversations${query ? `?${query}` : ''}`);
    },
    create: (data) => apiRequest('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    addMessage: (conversationId, message) => apiRequest('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message })
    }),
    delete: (id) => apiRequest(`/api/conversations?id=${id}`, {
      method: 'DELETE'
    })
  },

  // Interviews
  interviews: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/api/interviews${query ? `?${query}` : ''}`);
    },
    save: (sessionData) => apiRequest('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    })
  },

  // Progress
  progress: {
    get: () => apiRequest('/api/progress'),
    saveFeedback: (feedbackData) => apiRequest('/api/progress', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    })
  },

  // Scheduler
  scheduler: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/api/scheduler${query ? `?${query}` : ''}`);
    },
    create: (data) => apiRequest('/api/scheduler', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (interviewId, updates, toggleTaskIndex) => apiRequest('/api/scheduler', {
      method: 'PUT',
      body: JSON.stringify({ interviewId, updates, toggleTaskIndex })
    }),
    delete: (id) => apiRequest(`/api/scheduler?id=${id}`, {
      method: 'DELETE'
    })
  }
};

export default api;
