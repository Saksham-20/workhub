const User = require('../models/User');

class ProfileController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await User.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json({ profile });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body || {};

      // Remove sensitive fields that shouldn't be updated via profile
      delete profileData.id;
      delete profileData.email;
      delete profileData.role;
      delete profileData.password;
      delete profileData.created_at;

      // Drop unknown fields pre-emptively to avoid silent 500s from SQL
      const knownFields = new Set([
        'name','profile_picture','bio','location','hourly_rate','skills',
        'languages','availability','experience_level','education',
        'certifications','portfolio','testimonials','employment_history',
        'other_experiences','licenses','company_name','company_description',
        'company_website','company_size','industry','title','profile_boost',
        'work_history','project_catalog','budget_range','project_duration',
        'timezone_preference'
      ]);
      Object.keys(profileData).forEach((k) => {
        if (!knownFields.has(k) || profileData[k] === undefined) {
          delete profileData[k];
        }
      });

      if (Object.keys(profileData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      let updatedProfile;
      try {
        updatedProfile = await User.updateProfile(userId, profileData);
      } catch (err) {
        if (err && /No valid profile fields to update/i.test(err.message)) {
          return res.status(400).json({ error: 'No valid fields to update' });
        }
        throw err;
      }
      res.json({ 
        message: 'Profile updated successfully', 
        profile: updatedProfile 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get public profile (for viewing other users)
  static async getPublicProfile(req, res) {
    try {
      const { userId } = req.params;
      const profile = await User.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Remove sensitive information for public view
      const publicProfile = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        profile_picture: profile.profile_picture,
        bio: profile.bio,
        location: profile.location,
        hourly_rate: profile.hourly_rate,
        skills: profile.skills,
        languages: profile.languages,
        availability: profile.availability,
        experience_level: profile.experience_level,
        education: profile.education,
        certifications: profile.certifications,
        portfolio: profile.portfolio,
        testimonials: profile.testimonials,
        employment_history: profile.employment_history,
        other_experiences: profile.other_experiences,
        company_name: profile.company_name,
        company_description: profile.company_description,
        company_website: profile.company_website,
        company_size: profile.company_size,
        industry: profile.industry,
        created_at: profile.created_at
      };

      res.json({ profile: publicProfile });
    } catch (error) {
      console.error('Error getting public profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search freelancers
  static async searchFreelancers(req, res) {
    try {
      const filters = req.query;
      const freelancers = await User.searchFreelancers(filters);
      res.json({ freelancers });
    } catch (error) {
      console.error('Error searching freelancers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search clients
  static async searchClients(req, res) {
    try {
      const filters = req.query;
      const clients = await User.searchClients(filters);
      res.json({ clients });
    } catch (error) {
      console.error('Error searching clients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Upload profile picture (placeholder - would need file upload middleware)
  static async uploadProfilePicture(req, res) {
    try {
      const userId = req.user.id;
      const { profile_picture } = req.body;

      if (!profile_picture) {
        return res.status(400).json({ error: 'Profile picture URL is required' });
      }

      const updatedProfile = await User.updateProfile(userId, { profile_picture });
      res.json({ 
        message: 'Profile picture updated successfully', 
        profile: updatedProfile 
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get profile statistics
  static async getProfileStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await User.getUserStats(userId);
      res.json({ stats });
    } catch (error) {
      console.error('Error getting profile stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ProfileController;
