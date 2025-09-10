import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import { COMMON_SKILLS } from '../../utils/constants';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const handleTimelineChange = (e) => {
    const value = e.target.value;
    setJob(prev => ({
      ...prev,
      timeline: value,
      customTimeline: value === 'custom' ? prev.customTimeline : ''
    }));
  };

  const handleSkillToggle = (skill) => {
    setJob(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !job.skills.includes(customSkill.trim())) {
      setJob(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const handleCustomSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSkillAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (job.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.put(`/jobs/${id}`, {
        title: job.title,
        description: job.description,
        skills: job.skills,
        budget: parseFloat(job.budget),
        timeline: job.timeline === 'custom' ? job.customTimeline : job.timeline
      });
      
      navigate(`/jobs/${id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600 mt-2">
          Update the details of your job posting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field"
            placeholder="e.g., Build a React Website"
            value={job.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={8}
            className="input-field"
            placeholder="Describe your project in detail..."
            value={job.description}
            onChange={handleChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Include project goals, requirements, timeline, and any specific instructions.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_SKILLS.map(skill => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={job.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Skill Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom Skill
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={handleCustomSkillKeyPress}
                placeholder="Enter a custom skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleCustomSkillAdd}
                disabled={!customSkill.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Selected: {job.skills.length} skills
          </p>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Project Budget (INR)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            required
            min="1"
            step="0.01"
            className="input-field"
            placeholder="1000.00"
            value={job.budget}
            onChange={handleChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter your total project budget. This helps freelancers understand the scope.
          </p>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            value={job.timeline}
            onChange={handleTimelineChange}
            className="input-field"
          >
            <option value="">Select timeline</option>
            <option value="less-than-1-month">Less than 1 month</option>
            <option value="1-3-months">1-3 months</option>
            <option value="less-than-6-months">Less than 6 months</option>
            <option value="more-than-6-months">More than 6 months</option>
            <option value="custom">Custom timeline</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Select the estimated duration for your project completion.
          </p>
        </div>

        {job.timeline === 'custom' && (
          <div>
            <label htmlFor="customTimeline" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Timeline
            </label>
            <input
              type="text"
              id="customTimeline"
              name="customTimeline"
              required
              className="input-field"
              placeholder="e.g., 2 weeks, 4-6 months, 1 year, etc."
              value={job.customTimeline || ''}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your custom timeline description.
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Updating Job...' : 'Update Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/jobs/${id}`)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
