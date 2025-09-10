import React from 'react';

const ProfileMainContent = ({ profile, onEdit, userRole }) => {
  const renderFreelancerContent = () => (
    <div className="space-y-8">
      {/* Web and software development section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Web and software development</h2>
          <button
            onClick={() => onEdit('title')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-semibold text-green-600">${profile.hourly_rate}/hr</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit('hourly_rate')}
              className="w-5 h-5 text-green-600 hover:text-green-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-.758l1.102-1.101a4 4 0 105.656-5.656l4-4a4 4 0 00-5.656 0l-1.102 1.101" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          <button
            onClick={() => onEdit('bio')}
            className="absolute top-0 right-0 w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Portfolio section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
          <button
            onClick={() => onEdit('portfolio')}
            className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-green-500 text-green-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Published
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Drafts
            </button>
          </nav>
        </div>
        
        {profile.portfolio && profile.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.portfolio.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {item.type === 'image' && (
                  <img src={item.url || item.dataUrl} alt={item.title || 'Image'} className="w-full h-48 object-cover" />
                )}
                {item.type === 'video_link' && (
                  <div className="w-full h-48 bg-black flex items-center justify-center text-white">
                    <a href={item.url} target="_blank" rel="noreferrer" className="underline">Open video</a>
                  </div>
                )}
                {item.type === 'video' && (
                  <video className="w-full h-48 object-cover" controls src={item.url || item.dataUrl} />
                )}
                {item.type === 'text' && (
                  <div className="p-4 h-48 overflow-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.text}</p>
                  </div>
                )}
                {item.type === 'link' && (
                  <div className="p-4 h-48 flex items-center justify-center">
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-green-600 underline">
                      {item.title || item.url}
                    </a>
                  </div>
                )}
                {item.type === 'pdf' && (
                  <div className="p-4 h-48 flex items-center justify-center">
                    <a href={item.url || item.dataUrl} target="_blank" rel="noreferrer" className="text-gray-800 underline">{item.title || 'PDF'}</a>
                  </div>
                )}
                {item.type === 'audio' && (
                  <div className="p-4">
                    <audio controls src={item.url || item.dataUrl} className="w-full" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{item.title || (item.type && item.type.toUpperCase())}</h3>
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500">Add items to your portfolio to showcase your work</p>
          </div>
        )}
      </div>

      {/* Work history */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Work history</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No items</p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <button
            onClick={() => onEdit('skills')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills added yet</p>
        )}
      </div>

      {/* Project catalog */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your project catalog</h2>
        <p className="text-gray-700 mb-4">
          Projects are a new way to earn on Upwork that helps you do more of the work you love to do. 
          Create project offerings that highlight your strengths and attract more clients.
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
          Manage projects
        </button>
      </div>
    </div>
  );

  const renderClientContent = () => (
    <div className="space-y-8">
      {/* Company Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Company Description</h2>
          <button
            onClick={() => onEdit('company_description')}
            className="w-5 h-5 text-green-600 hover:text-green-700"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed">{profile.company_description}</p>
      </div>

      {/* Jobs Posted */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Jobs Posted</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs posted yet</p>
        </div>
      </div>

      {/* Hiring Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hiring Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Experience Level</label>
            <p className="text-gray-600">{profile.experience_level || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Budget Range</label>
            <p className="text-gray-600">Not specified</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {userRole === 'freelancer' ? renderFreelancerContent() : renderClientContent()}
    </div>
  );
};

export default ProfileMainContent;
