import api from './api';

// Proposal API calls
export const proposalAPI = {
  // Create proposal
  create: async (proposalData) => {
    try {
      const response = await api.post('/proposals', proposalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create proposal' };
    }
  },

  // Get proposals for a job
  getForJob: async (jobId) => {
    try {
      const response = await api.get(`/proposals/job/${jobId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch proposals' };
    }
  },

  // Update proposal status
  updateStatus: async (proposalId, status) => {
    try {
      const response = await api.put(`/proposals/${proposalId}`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update proposal' };
    }
  }
};

// Counter bid API calls
export const counterBidAPI = {
  // Create counter bid
  create: async (counterBidData) => {
    try {
      const response = await api.post('/proposals/counter-bids', counterBidData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create counter bid' };
    }
  },

  // Get user's counter bids
  getUserCounterBids: async () => {
    try {
      const response = await api.get('/proposals/counter-bids/user');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch counter bids' };
    }
  },

  // Respond to counter bid
  respond: async (counterBidId, responseData) => {
    try {
      const response = await api.put(`/proposals/counter-bids/${counterBidId}`, responseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to respond to counter bid' };
    }
  }
};

// Job API calls
export const jobAPI = {
  // Get all jobs
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/jobs?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch jobs' };
    }
  },

  // Get job by ID
  getById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch job' };
    }
  },

  // Create job
  create: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create job' };
    }
  },

  // Get user's jobs
  getUserJobs: async () => {
    try {
      const response = await api.get('/jobs/my-jobs');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch user jobs' };
    }
  }
};

// Auth API calls
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  }
};