import api from './api';

class ProfileService {
  // Get current user's profile
  static async getProfile() {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update current user's profile
  static async updateProfile(profileData) {
    try {
      const response = await api.put('/profile/me', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(pictureUrl) {
    try {
      const response = await api.post('/profile/me/picture', { profile_picture: pictureUrl });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get profile statistics
  static async getProfileStats() {
    try {
      const response = await api.get('/profile/me/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get public profile of another user
  static async getPublicProfile(userId) {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search freelancers
  static async searchFreelancers(filters = {}) {
    try {
      const response = await api.get('/profile/search/freelancers', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search clients
  static async searchClients(filters = {}) {
    try {
      const response = await api.get('/profile/search/clients', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileService;
