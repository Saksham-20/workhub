import React from 'react';

const ProfileSidebar = ({ profile, onEdit, userRole, jobStats }) => {
  const getSocialIcon = (platform) => {
    const icons = {
      'GitHub': '🐙',
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'Instagram': '📷',
      'Facebook': '📘',
      'YouTube': '📺',
      'Portfolio': '🌐',
      'Other': '🔗'
    };
    return icons[platform] || '🔗';
  };
  const renderFreelancerSidebar = () => (
    <div className="space-y-6">
      {/* Freelancer Plus Offer Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-green-800">FREELANCER PLUS OFFER</span>
        </div>
        <p className="text-xs text-green-700 mt-2">
          Get Freelancer Plus for 50% off one month and keep your profile visible during breaks. Limited time only.
        </p>
        <div className="mt-2">
          <svg className="w-4 h-4 text-green-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hours per week */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Hours per week</h3>
          <button
            onClick={() => onEdit('availability')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600">{profile.availability}</p>
        <p className="text-sm text-gray-600">Open to contract to hire</p>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Languages</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit('languages')}
              className="w-5 h-5 text-green-600 hover:text-green-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => onEdit('languages')}
              className="w-5 h-5 text-green-600 hover:text-green-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        {profile.languages && Object.keys(profile.languages).length > 0 ? (
          <div className="space-y-1">
            {Object.entries(profile.languages).map(([lang, level]) => (
              <p key={lang} className="text-sm text-gray-600">
                {lang}: {level}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No languages added</p>
        )}
      </div>

      {/* Verifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Verifications</h3>
          <button
            onClick={() => onEdit('verifications')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        {profile.verifications && profile.verifications.length > 0 ? (
          <div className="space-y-1">
            {profile.verifications.map((verification, index) => (
              <p key={index} className="text-sm text-gray-600">{verification}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No verifications added</p>
        )}
      </div>

      {/* Licenses */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Licenses</h3>
          <button
            onClick={() => onEdit('licenses')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        {profile.licenses && profile.licenses.length > 0 ? (
          <div className="space-y-1">
            {profile.licenses.map((license, index) => (
              <p key={index} className="text-sm text-gray-600">
                {license.name} • {license.organization} {license.id ? `• ${license.id}` : ''}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No licenses added</p>
        )}
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Education</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit('education')}
              className="w-5 h-5 text-green-600 hover:text-green-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => onEdit('education')}
              className="w-5 h-5 text-green-600 hover:text-green-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit('education')}
              className="w-5 h-5 text-red-600 hover:text-red-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {profile.education && profile.education.length > 0 ? (
          <div className="space-y-2">
            {profile.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
                <p className="text-gray-500">{edu.years}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No education added</p>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Social Links</h3>
          <button
            onClick={() => onEdit('social_links')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        {profile.social_links && profile.social_links.length > 0 ? (
          <div className="space-y-2">
            {profile.social_links.map((link, index) => (
              <div key={index} className="flex items-center justify-between">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 flex items-center"
                >
                  <span className="mr-2">{getSocialIcon(link.platform)}</span>
                  {link.platform}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No social links added</p>
        )}
      </div>
    </div>
  );

  const renderClientSidebar = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Company Info</h3>
          <button
            onClick={() => onEdit('company_info')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Industry:</span> {profile.industry}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Size:</span> {profile.company_size}
          </p>
          {profile.company_website && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Website:</span> 
              <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 ml-1">
                {profile.company_website}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Project Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Project Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Jobs Posted</span>
            <span className="text-sm font-medium text-gray-900">
              {jobStats?.total_jobs || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Open Jobs</span>
            <span className="text-sm font-medium text-green-600">
              {jobStats?.open_jobs || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">In Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {jobStats?.in_progress_jobs || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="text-sm font-medium text-gray-600">
              {jobStats?.completed_jobs || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Proposals</span>
            <span className="text-sm font-medium text-purple-600">
              {jobStats?.total_proposals || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {userRole === 'freelancer' ? renderFreelancerSidebar() : renderClientSidebar()}
    </div>
  );
};

export default ProfileSidebar;
