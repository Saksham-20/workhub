import React, { useState, useEffect, useCallback } from 'react';

const ProfileEditModal = ({ isOpen, onClose, section, profile, onSave, loading, userRole }) => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Helpers specific to portfolio editing
  const MAX_IMAGE_MB = 10;
  const MAX_AUDIO_MB = 10;
  const MAX_VIDEO_MB = 100;
  const MAX_PDF_MB = 10;
  const MAX_PDF_FILES = 5;

  const bytesToMb = (bytes) => Math.round((bytes / (1024 * 1024)) * 10) / 10;

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const initializeFormData = useCallback(() => {
    if (!section || !profile) return;
    
    switch (section) {
      case 'header':
        setFormData({
          name: profile.name || '',
          location: profile.location || '',
          hourly_rate: profile.hourly_rate || '',
          bio: profile.bio || ''
        });
        break;
      case 'profile_picture':
        setFormData({
          profile_picture: profile.profile_picture || ''
        });
        break;
      case 'skills':
        setFormData({
          skills: profile.skills || []
        });
        break;
      case 'languages':
        setFormData({
          languages: profile.languages || {}
        });
        break;
      case 'availability':
        setFormData({
          availability: profile.availability || ''
        });
        break;
      case 'education':
        setFormData({
          education: profile.education || []
        });
        break;
      case 'certifications':
        setFormData({
          certifications: profile.certifications || []
        });
        break;
      case 'portfolio':
        setFormData({
          portfolio: Array.isArray(profile.portfolio) ? profile.portfolio : []
        });
        break;
      case 'testimonials':
        setFormData({
          testimonials: profile.testimonials || []
        });
        break;
      case 'employment_history':
        setFormData({
          employment_history: profile.employment_history || []
        });
        break;
      case 'other_experiences':
        setFormData({
          other_experiences: profile.other_experiences || []
        });
        break;
      case 'company_info':
        setFormData({
          company_name: profile.company_name || '',
          company_description: profile.company_description || '',
          company_website: profile.company_website || '',
          company_size: profile.company_size || '',
          industry: profile.industry || ''
        });
        break;
      default:
        setFormData({});
    }
  }, [section, profile]);

  useEffect(() => {
    if (section && profile) {
      initializeFormData();
    }
  }, [section, profile, initializeFormData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    onSave(formData);
  };

  const renderForm = () => {
    switch (section) {
      case 'bio':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio ?? profile.bio ?? ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );

      case 'hourly_rate':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($/hr)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.hourly_rate ?? profile.hourly_rate ?? 0}
              onChange={(e) => handleInputChange('hourly_rate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {userRole === 'freelancer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        );

      case 'profile_picture':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
            <input
              type="url"
              value={formData.profile_picture || ''}
              onChange={(e) => handleInputChange('profile_picture', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-4">
            <div className="rounded-md border border-dashed border-gray-300 p-4">
              <p className="text-sm text-gray-700 mb-3">Add content</p>
              <div className="grid grid-cols-6 gap-3">
                {/* Image */}
                <label className="cursor-pointer flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                        setErrorMessage(`Image must be <= ${MAX_IMAGE_MB} MB (got ${bytesToMb(file.size)} MB)`);
                        return;
                      }
                      const dataUrl = await readFileAsDataUrl(file);
                      setFormData((prev) => ({
                        ...prev,
                        portfolio: [
                          ...(prev.portfolio || []),
                          {
                            type: 'image',
                            title: file.name,
                            dataUrl,
                            sizeMb: bytesToMb(file.size)
                          }
                        ]
                      }));
                    }}
                  />
                  <span className="text-sm text-gray-700">Image</span>
                  <span className="text-[11px] text-gray-400">up to {MAX_IMAGE_MB} MB</span>
                </label>

                {/* Video link */}
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt('Enter YouTube URL or direct video URL');
                    if (!url) return;
                    setFormData((prev) => ({
                      ...prev,
                      portfolio: [
                        ...(prev.portfolio || []),
                        { type: 'video_link', url }
                      ]
                    }));
                  }}
                  className="flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Video link</span>
                  <span className="text-[11px] text-gray-400">YouTube or MP4 URL</span>
                </button>

                {/* Video upload */}
                <label className="cursor-pointer flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
                        setErrorMessage(`Video must be <= ${MAX_VIDEO_MB} MB (got ${bytesToMb(file.size)} MB)`);
                        return;
                      }
                      // Note: Storing large base64 may not be ideal; backend upload is recommended.
                      const dataUrl = await readFileAsDataUrl(file);
                      setFormData((prev) => ({
                        ...prev,
                        portfolio: [
                          ...(prev.portfolio || []),
                          {
                            type: 'video',
                            title: file.name,
                            dataUrl,
                            sizeMb: bytesToMb(file.size)
                          }
                        ]
                      }));
                    }}
                  />
                  <span className="text-sm text-gray-700">Video</span>
                  <span className="text-[11px] text-gray-400">up to {MAX_VIDEO_MB} MB</span>
                </label>

                {/* Text */}
                <button
                  type="button"
                  onClick={() => {
                    const title = window.prompt('Enter a title for this text');
                    const text = window.prompt('Enter the text content');
                    if (!text) return;
                    setFormData((prev) => ({
                      ...prev,
                      portfolio: [
                        ...(prev.portfolio || []),
                        { type: 'text', title: title || 'Text', text }
                      ]
                    }));
                  }}
                  className="flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Text</span>
                </button>

                {/* Link */}
                <button
                  type="button"
                  onClick={() => {
                    const label = window.prompt('Enter a title/label for the link');
                    const url = window.prompt('Enter the website URL');
                    if (!url) return;
                    setFormData((prev) => ({
                      ...prev,
                      portfolio: [
                        ...(prev.portfolio || []),
                        { type: 'link', title: label || 'Link', url }
                      ]
                    }));
                  }}
                  className="flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Link</span>
                </button>

                {/* PDF */}
                <label className="cursor-pointer flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      const currentPdfCount = (formData.portfolio || []).filter((x) => x.type === 'pdf').length;
                      if (currentPdfCount + files.length > MAX_PDF_FILES) {
                        setErrorMessage(`You can attach up to ${MAX_PDF_FILES} PDF files in total`);
                        return;
                      }
                      const additions = [];
                      for (const file of files) {
                        if (file.size > MAX_PDF_MB * 1024 * 1024) {
                          setErrorMessage(`PDF ${file.name} exceeds ${MAX_PDF_MB} MB (got ${bytesToMb(file.size)} MB)`);
                          return;
                        }
                        const dataUrl = await readFileAsDataUrl(file);
                        additions.push({
                          type: 'pdf',
                          title: file.name,
                          dataUrl,
                          sizeMb: bytesToMb(file.size)
                        });
                      }
                      setFormData((prev) => ({
                        ...prev,
                        portfolio: [ ...(prev.portfolio || []), ...additions ]
                      }));
                    }}
                  />
                  <span className="text-sm text-gray-700">PDF</span>
                  <span className="text-[11px] text-gray-400">up to {MAX_PDF_MB} MB, max {MAX_PDF_FILES}</span>
                </label>

                {/* Audio */}
                <label className="cursor-pointer flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
                        setErrorMessage(`Audio must be <= ${MAX_AUDIO_MB} MB (got ${bytesToMb(file.size)} MB)`);
                        return;
                      }
                      const dataUrl = await readFileAsDataUrl(file);
                      setFormData((prev) => ({
                        ...prev,
                        portfolio: [
                          ...(prev.portfolio || []),
                          { type: 'audio', title: file.name, dataUrl, sizeMb: bytesToMb(file.size) }
                        ]
                      }));
                    }}
                  />
                  <span className="text-sm text-gray-700">Audio</span>
                  <span className="text-[11px] text-gray-400">up to {MAX_AUDIO_MB} MB</span>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
              {(formData.portfolio || []).length === 0 ? (
                <p className="text-sm text-gray-500">No items added yet</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {(formData.portfolio || []).map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded border border-gray-200 p-2">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 truncate">[{item.type}] {item.title || item.url || 'Untitled'}</p>
                        {item.sizeMb && (
                          <p className="text-[11px] text-gray-500">{item.sizeMb} MB</p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-red-600 text-sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            portfolio: (prev.portfolio || []).filter((_, i) => i !== idx)
                          }));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
              onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="Web Development, React, Node.js"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Language (e.g., English)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                id="lang-name"
              />
              <select
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                id="lang-level"
                defaultValue="Conversational"
              >
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
              <button
                type="button"
                className="px-3 py-2 bg-green-600 text-white rounded-md"
                onClick={() => {
                  const name = document.getElementById('lang-name')?.value?.trim();
                  const level = document.getElementById('lang-level')?.value;
                  if (!name) return;
                  handleInputChange('languages', { ...(formData.languages || {}), [name]: level });
                  if (document.getElementById('lang-name')) document.getElementById('lang-name').value = '';
                }}
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.languages && Object.keys(formData.languages).length > 0 ? (
                Object.entries(formData.languages).map(([lang, level]) => (
                  <div key={lang} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                    <span className="text-sm text-gray-800">{lang}: {level}</span>
                    <button
                      type="button"
                      className="text-red-600 text-sm"
                      onClick={() => {
                        const next = { ...(formData.languages || {}) };
                        delete next[lang];
                        handleInputChange('languages', next);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No languages added</p>
              )}
            </div>
          </div>
        );

      case 'availability':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={formData.availability || ''}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select availability</option>
              <option value="Less than 10 hrs/week">Less than 10 hrs/week</option>
              <option value="10-19 hrs/week">10-19 hrs/week</option>
              <option value="20-29 hrs/week">20-29 hrs/week</option>
              <option value="30-39 hrs/week">30-39 hrs/week</option>
              <option value="More than 30 hrs/week">More than 30 hrs/week</option>
            </select>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input id="edu-school" placeholder="School" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="edu-degree" placeholder="Degree" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="edu-years" placeholder="Years (e.g., 2018-2022)" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const school = document.getElementById('edu-school')?.value?.trim();
                const degree = document.getElementById('edu-degree')?.value?.trim();
                const years = document.getElementById('edu-years')?.value?.trim();
                if (!school) return;
                handleInputChange('education', [ ...(formData.education || []), { school, degree, years } ]);
                ['edu-school','edu-degree','edu-years'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.education || []).map((e, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{e.school} • {e.degree} • {e.years}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('education', (formData.education || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input id="cert-name" placeholder="Certification" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="cert-issuer" placeholder="Issuer" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="cert-year" placeholder="Year" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const name = document.getElementById('cert-name')?.value?.trim();
                const issuer = document.getElementById('cert-issuer')?.value?.trim();
                const year = document.getElementById('cert-year')?.value?.trim();
                if (!name) return;
                handleInputChange('certifications', [ ...(formData.certifications || []), { name, issuer, year } ]);
                ['cert-name','cert-issuer','cert-year'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.certifications || []).map((c, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{c.name} • {c.issuer} • {c.year}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('certifications', (formData.certifications || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'employment_history':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <input id="emp-company" placeholder="Company" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="emp-role" placeholder="Role" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="emp-duration" placeholder="Duration" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="emp-desc" placeholder="Short description" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const company = document.getElementById('emp-company')?.value?.trim();
                const role = document.getElementById('emp-role')?.value?.trim();
                const duration = document.getElementById('emp-duration')?.value?.trim();
                const description = document.getElementById('emp-desc')?.value?.trim();
                if (!company || !role) return;
                handleInputChange('employment_history', [ ...(formData.employment_history || []), { company, role, duration, description } ]);
                ['emp-company','emp-role','emp-duration','emp-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.employment_history || []).map((job, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{job.company} • {job.role} • {job.duration}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('employment_history', (formData.employment_history || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input id="testi-author" placeholder="Author" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="testi-text" placeholder="Feedback" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const author = document.getElementById('testi-author')?.value?.trim();
                const text = document.getElementById('testi-text')?.value?.trim();
                if (!text) return;
                handleInputChange('testimonials', [ ...(formData.testimonials || []), { author, text } ]);
                ['testi-author','testi-text'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.testimonials || []).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{t.author ? `${t.author}: ` : ''}{t.text}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('testimonials', (formData.testimonials || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'other_experiences':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input id="other-title" placeholder="Title" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="other-desc" placeholder="Description" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const title = document.getElementById('other-title')?.value?.trim();
                const description = document.getElementById('other-desc')?.value?.trim();
                if (!title && !description) return;
                handleInputChange('other_experiences', [ ...(formData.other_experiences || []), { title, description } ]);
                ['other-title','other-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.other_experiences || []).map((o, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{o.title} {o.description ? `• ${o.description}` : ''}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('other_experiences', (formData.other_experiences || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'company_info':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
              <textarea
                value={formData.company_description || ''}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
              <input
                type="url"
                value={formData.company_website || ''}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                value={formData.company_size || ''}
                onChange={(e) => handleInputChange('company_size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select company size</option>
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="Technology, Healthcare, Finance, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input id="verif-text" placeholder="Verification (e.g., ID, Email)" className="flex-1 px-2 py-2 border border-gray-300 rounded" />
              <button
                type="button"
                className="px-3 py-2 bg-green-600 text-white rounded-md"
                onClick={() => {
                  const val = document.getElementById('verif-text')?.value?.trim();
                  if (!val) return;
                  const list = Array.isArray(formData.certifications) ? formData.certifications : [];
                  handleInputChange('certifications', [ ...list, val ]);
                  const el = document.getElementById('verif-text'); if (el) el.value = '';
                }}
              >Add</button>
            </div>
            <div className="space-y-2">
              {(formData.certifications || []).map((v, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{v}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('certifications', (formData.certifications || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
              {(formData.certifications || []).length === 0 && (
                <p className="text-sm text-gray-500">No certifications added</p>
              )}
            </div>
          </div>
        );

      case 'licenses':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input id="lic-name" placeholder="License" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="lic-org" placeholder="Organization" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="lic-id" placeholder="ID/Number (optional)" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const name = document.getElementById('lic-name')?.value?.trim();
                const org = document.getElementById('lic-org')?.value?.trim();
                const num = document.getElementById('lic-id')?.value?.trim();
                if (!name) return;
                const list = Array.isArray(formData.licenses) ? formData.licenses : [];
                handleInputChange('licenses', [ ...list, { name, organization: org, id: num } ]);
                ['lic-name','lic-org','lic-id'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.licenses || []).map((l, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{l.name} • {l.organization} {l.id ? `• ${l.id}` : ''}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('licenses', (formData.licenses || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
              {(formData.licenses || []).length === 0 && (
                <p className="text-sm text-gray-500">No licenses added</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Edit form for {section} not implemented yet</p>
          </div>
        );
    }
  };

  const getModalTitle = () => {
    const titles = {
      header: 'Edit Profile',
      profile_picture: 'Update Profile Picture',
      skills: 'Edit Skills',
      languages: 'Edit Languages',
      availability: 'Edit Availability',
      education: 'Edit Education',
      certifications: 'Edit Certifications',
      portfolio: 'Edit Portfolio',
      testimonials: 'Edit Testimonials',
      employment_history: 'Edit Employment History',
      other_experiences: 'Edit Other Experiences',
      company_info: 'Edit Company Information'
    };
    return titles[section] || 'Edit Profile';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{getModalTitle()}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
