import React, { useState, useEffect, useCallback } from 'react';

const ProfileEditModal = ({ isOpen, onClose, section, profile, onSave, loading, userRole }) => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [licenseInput, setLicenseInput] = useState({ name: '', organization: '', id: '' });

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
        try {
          const raw = profile.certifications;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({
            certifications: Array.isArray(parsed) ? parsed : []
          });
        } catch (e) {
          setFormData({ certifications: [] });
        }
        break;
      case 'verifications':
        try {
          const raw = profile.verifications;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({
            verifications: Array.isArray(parsed) ? parsed : []
          });
        } catch (e) {
          setFormData({ verifications: [] });
        }
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
        try {
          const raw = profile.employment_history;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ employment_history: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ employment_history: [] });
        }
        break;
      case 'other_experiences':
        try {
          const raw = profile.other_experiences;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ other_experiences: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ other_experiences: [] });
        }
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
      case 'title':
        setFormData({
          title: profile.title || ''
        });
        break;
      case 'profile_boost':
        setFormData({
          profile_boost: profile.profile_boost || false
        });
        break;
      case 'company_description':
        setFormData({
          company_description: profile.company_description || ''
        });
        break;
      case 'experience_level':
        setFormData({
          experience_level: profile.experience_level || ''
        });
        break;
      case 'licenses':
        try {
          const raw = profile.licenses;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ licenses: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ licenses: [] });
        }
        break;
      case 'work_history':
        try {
          const raw = profile.work_history;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ work_history: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ work_history: [] });
        }
        break;
      case 'project_catalog':
        try {
          const raw = profile.project_catalog;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ project_catalog: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ project_catalog: [] });
        }
        break;
      case 'hiring_preferences':
        setFormData({
          experience_level: profile.experience_level || '',
          budget_range: profile.budget_range || '',
          project_duration: profile.project_duration || '',
          timezone_preference: profile.timezone_preference || ''
        });
        break;
      case 'social_links':
        try {
          const raw = profile.social_links;
          const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
          setFormData({ social_links: Array.isArray(parsed) ? parsed : [] });
        } catch (e) {
          setFormData({ social_links: [] });
        }
        break;
      default:
        setFormData({});
    }
  }, [section, profile]);

  useEffect(() => {
    if (section && profile) {
      initializeFormData();
      // Reset license input when modal opens
      if (section === 'licenses') {
        setLicenseInput({ name: '', organization: '', id: '' });
      }
    }
  }, [section, profile, initializeFormData]);

  const handleInputChange = (field, value) => {
    console.log('handleInputChange called:', field, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    console.log('Form submitted with data:', formData);
    console.log('onSave function:', onSave);
    
    // Check if formData is empty
    if (Object.keys(formData).length === 0) {
      setErrorMessage('No changes to save');
      return;
    }
    
    // Check if onSave function exists
    if (typeof onSave !== 'function') {
      setErrorMessage('Save function not available');
      return;
    }
    
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

      case 'verifications':
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
                  const list = Array.isArray(formData.verifications) ? formData.verifications : [];
                  handleInputChange('verifications', [ ...list, val ]);
                  const el = document.getElementById('verif-text'); if (el) el.value = '';
                }}
              >Add</button>
            </div>
            <div className="space-y-2">
              {(formData.verifications || []).map((v, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{v}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('verifications', (formData.verifications || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
              {(formData.verifications || []).length === 0 && (
                <p className="text-sm text-gray-500">No verifications added</p>
              )}
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
              <input 
                placeholder="License" 
                value={licenseInput.name}
                onChange={(e) => setLicenseInput(prev => ({ ...prev, name: e.target.value }))}
                className="px-2 py-2 border border-gray-300 rounded" 
              />
              <input 
                placeholder="Organization" 
                value={licenseInput.organization}
                onChange={(e) => setLicenseInput(prev => ({ ...prev, organization: e.target.value }))}
                className="px-2 py-2 border border-gray-300 rounded" 
              />
              <input 
                placeholder="ID/Number (optional)" 
                value={licenseInput.id}
                onChange={(e) => setLicenseInput(prev => ({ ...prev, id: e.target.value }))}
                className="px-2 py-2 border border-gray-300 rounded" 
              />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const { name, organization, id } = licenseInput;
                if (!name.trim()) return;
                const list = Array.isArray(formData.licenses) ? formData.licenses : [];
                handleInputChange('licenses', [ ...list, { name: name.trim(), organization: organization.trim(), id: id.trim() } ]);
                setLicenseInput({ name: '', organization: '', id: '' });
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

      case 'title':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Senior Web Developer, UI/UX Designer"
            />
          </div>
        );

      case 'profile_boost':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="profile_boost"
                checked={formData.profile_boost || false}
                onChange={(e) => handleInputChange('profile_boost', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="profile_boost" className="ml-2 block text-sm text-gray-900">
                Enable Profile Boost
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Boost your profile to get more visibility and attract more clients.
            </p>
          </div>
        );

      case 'company_description':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
            <textarea
              value={formData.company_description || ''}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe your company, its mission, and what makes it unique..."
            />
          </div>
        );

      case 'experience_level':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={formData.experience_level || ''}
              onChange={(e) => handleInputChange('experience_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="intermediate">Intermediate (3-5 years)</option>
              <option value="expert">Expert (6+ years)</option>
            </select>
          </div>
        );

      case 'work_history':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input id="wh-company" placeholder="Company" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="wh-position" placeholder="Position" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input id="wh-start" placeholder="Start Date (MM/YYYY)" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="wh-end" placeholder="End Date (MM/YYYY)" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <textarea id="wh-description" placeholder="Description" rows={3} className="w-full px-2 py-2 border border-gray-300 rounded" />
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const company = document.getElementById('wh-company')?.value?.trim();
                const position = document.getElementById('wh-position')?.value?.trim();
                const start = document.getElementById('wh-start')?.value?.trim();
                const end = document.getElementById('wh-end')?.value?.trim();
                const description = document.getElementById('wh-description')?.value?.trim();
                if (!company || !position) return;
                const list = Array.isArray(formData.work_history) ? formData.work_history : [];
                handleInputChange('work_history', [ ...list, { company, position, start, end, description } ]);
                ['wh-company','wh-position','wh-start','wh-end','wh-description'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add</button>
            <div className="space-y-2">
              {(formData.work_history || []).map((job, idx) => (
                <div key={idx} className="border border-gray-200 rounded px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{job.position} at {job.company}</p>
                      <p className="text-sm text-gray-600">{job.start} - {job.end}</p>
                      {job.description && <p className="text-sm text-gray-700 mt-1">{job.description}</p>}
                    </div>
                    <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('work_history', (formData.work_history || []).filter((_, i) => i!==idx))}>Remove</button>
                  </div>
                </div>
              ))}
              {(formData.work_history || []).length === 0 && (
                <p className="text-sm text-gray-500">No work history added</p>
              )}
            </div>
          </div>
        );

      case 'project_catalog':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input id="pc-title" placeholder="Project Title" className="px-2 py-2 border border-gray-300 rounded" />
              <input id="pc-price" placeholder="Price" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <textarea id="pc-description" placeholder="Project Description" rows={3} className="w-full px-2 py-2 border border-gray-300 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input id="pc-duration" placeholder="Duration (e.g., 1 week)" className="px-2 py-2 border border-gray-300 rounded" />
              <select id="pc-category" className="px-2 py-2 border border-gray-300 rounded">
                <option value="">Select Category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="writing">Writing</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const title = document.getElementById('pc-title')?.value?.trim();
                const price = document.getElementById('pc-price')?.value?.trim();
                const description = document.getElementById('pc-description')?.value?.trim();
                const duration = document.getElementById('pc-duration')?.value?.trim();
                const category = document.getElementById('pc-category')?.value?.trim();
                if (!title || !price) return;
                const list = Array.isArray(formData.project_catalog) ? formData.project_catalog : [];
                handleInputChange('project_catalog', [ ...list, { title, price, description, duration, category } ]);
                ['pc-title','pc-price','pc-description','pc-duration','pc-category'].forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
              }}
            >Add Project</button>
            <div className="space-y-2">
              {(formData.project_catalog || []).map((project, idx) => (
                <div key={idx} className="border border-gray-200 rounded px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-sm text-gray-600">{project.price} • {project.duration}</p>
                      {project.description && <p className="text-sm text-gray-700 mt-1">{project.description}</p>}
                    </div>
                    <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('project_catalog', (formData.project_catalog || []).filter((_, i) => i!==idx))}>Remove</button>
                  </div>
                </div>
              ))}
              {(formData.project_catalog || []).length === 0 && (
                <p className="text-sm text-gray-500">No projects added</p>
              )}
            </div>
          </div>
        );

      case 'hiring_preferences':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Experience Level</label>
              <select
                value={formData.experience_level || ''}
                onChange={(e) => handleInputChange('experience_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="intermediate">Intermediate (3-5 years)</option>
                <option value="expert">Expert (6+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={formData.budget_range || ''}
                onChange={(e) => handleInputChange('budget_range', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select budget range</option>
                <option value="under-500">Under $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="over-10000">Over $10,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Duration</label>
              <select
                value={formData.project_duration || ''}
                onChange={(e) => handleInputChange('project_duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select duration</option>
                <option value="less-than-week">Less than 1 week</option>
                <option value="1-4-weeks">1-4 weeks</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="over-6-months">Over 6 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone Preference</label>
              <select
                value={formData.timezone_preference || ''}
                onChange={(e) => handleInputChange('timezone_preference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select timezone</option>
                <option value="pst">Pacific (PST)</option>
                <option value="mst">Mountain (MST)</option>
                <option value="cst">Central (CST)</option>
                <option value="est">Eastern (EST)</option>
                <option value="utc">UTC</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        );

      case 'social_links':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select id="social-platform" className="px-2 py-2 border border-gray-300 rounded">
                <option value="">Select Platform</option>
                <option value="GitHub">GitHub</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Other">Other</option>
              </select>
              <input id="social-url" placeholder="URL" className="px-2 py-2 border border-gray-300 rounded" />
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                const platform = document.getElementById('social-platform')?.value?.trim();
                const url = document.getElementById('social-url')?.value?.trim();
                if (!platform || !url) return;
                const list = Array.isArray(formData.social_links) ? formData.social_links : [];
                handleInputChange('social_links', [ ...list, { platform, url } ]);
                document.getElementById('social-platform').value = '';
                document.getElementById('social-url').value = '';
              }}
            >Add Link</button>
            <div className="space-y-2">
              {(formData.social_links || []).map((link, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded px-2 py-1">
                  <span className="text-sm text-gray-800 truncate">{link.platform}: {link.url}</span>
                  <button type="button" className="text-red-600 text-sm" onClick={() => handleInputChange('social_links', (formData.social_links || []).filter((_, i) => i!==idx))}>Remove</button>
                </div>
              ))}
              {(formData.social_links || []).length === 0 && (
                <p className="text-sm text-gray-500">No social links added</p>
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
      verifications: 'Edit Verifications',
      portfolio: 'Edit Portfolio',
      testimonials: 'Edit Testimonials',
      employment_history: 'Edit Employment History',
      other_experiences: 'Edit Other Experiences',
      company_info: 'Edit Company Information',
      title: 'Edit Professional Title',
      profile_boost: 'Profile Boost Settings',
      company_description: 'Edit Company Description',
      experience_level: 'Edit Experience Level',
      licenses: 'Edit Licenses',
      work_history: 'Edit Work History',
      project_catalog: 'Manage Project Catalog',
      hiring_preferences: 'Edit Hiring Preferences',
      social_links: 'Edit Social Links'
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
            
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={(e) => {
                  console.log('Save button clicked');
                  handleSubmit(e);
                }}
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
