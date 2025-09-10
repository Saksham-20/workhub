import React from 'react';

const ProfileSidebar = ({ profile, onEdit, userRole }) => {
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

      {/* Promote with ads */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Promote with ads</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Availability badge</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Off</span>
              <button
                onClick={() => onEdit('availability')}
                className="w-5 h-5 text-green-600 hover:text-green-700"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Boost your profile</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Off</span>
              <button
                onClick={() => onEdit('profile_boost')}
                className="w-5 h-5 text-green-600 hover:text-green-700"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connects */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Connects</h3>
          <span className="text-lg font-semibold text-green-600">101</span>
        </div>
        <div className="space-y-2">
          <button className="text-sm text-green-600 hover:text-green-700 block text-left w-full">View details</button>
          <button className="text-sm text-green-600 hover:text-green-700 block text-left w-full">Buy Connects</button>
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
            onClick={() => onEdit('certifications')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600">Military veteran</p>
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
        <p className="text-sm text-gray-500">No licenses added</p>
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

      {/* Linked accounts */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Linked accounts</h3>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
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
            <span className="text-sm font-medium text-gray-900">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900">Hired Freelancers</span>
            <span className="text-sm font-medium text-gray-900">0</span>
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
