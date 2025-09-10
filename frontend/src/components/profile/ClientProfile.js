import React, { useState } from 'react';
import ProfileService from '../../services/profileService';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileMainContent from './ProfileMainContent';
import ProfileEditModal from './ProfileEditModal';

const ClientProfile = ({ profile, setProfile, jobStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const response = await ProfileService.updateProfile(updatedData);
      setProfile(response.profile);
      setIsEditing(false);
      setEditSection(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (section) => {
    setEditSection(section);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditSection(null);
  };

  const profileData = {
    ...profile,
    // Default values for missing fields
    profile_picture: profile.profile_picture || '/default-company-logo.png',
    bio: profile.bio || 'No company description added yet.',
    location: profile.location || 'Location not specified',
    company_name: profile.company_name || profile.name || 'Company name not specified',
    company_description: profile.company_description || 'No company description added yet.',
    company_website: profile.company_website || '',
    company_size: profile.company_size || 'Not specified',
    industry: profile.industry || 'Not specified'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader 
        profile={profileData} 
        onEdit={() => openEditModal('header')}
        userRole="client"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar 
              profile={profileData}
              onEdit={openEditModal}
              userRole="client"
              jobStats={jobStats}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProfileMainContent 
              profile={profileData}
              onEdit={openEditModal}
              userRole="client"
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <ProfileEditModal
          isOpen={isEditing}
          onClose={closeEditModal}
          section={editSection}
          profile={profileData}
          onSave={handleProfileUpdate}
          loading={loading}
          userRole="client"
        />
      )}
    </div>
  );
};

export default ClientProfile;
