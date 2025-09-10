import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { COMMON_SKILLS } from '../../utils/constants';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    budget: '',
    timeline: '',
    customTimeline: ''
  });
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTimelineChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      timeline: value,
      customTimeline: value === 'custom' ? prev.customTimeline : ''
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
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
    
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/jobs', {
        ...formData,
        budget: parseFloat(formData.budget),
        timeline: formData.timeline === 'custom' ? formData.customTimeline : formData.timeline
      });
      
      navigate(`/jobs/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-2">
          Fill out the details below to find the perfect freelancer for your project.
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
            value={formData.title}
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
            value={formData.description}
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
                  checked={formData.skills.includes(skill)}
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
            Selected: {formData.skills.length} skills
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
            value={formData.budget}
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
            value={formData.timeline}
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

        {formData.timeline === 'custom' && (
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
              value={formData.customTimeline}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your custom timeline description.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting Job...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;