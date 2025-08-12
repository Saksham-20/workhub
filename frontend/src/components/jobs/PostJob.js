import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { COMMON_SKILLS } from '../../utils/constants';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
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
        budget: parseFloat(formData.budget)
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
          <p className="text-sm text-gray-500 mt-2">
            Selected: {formData.skills.length} skills
          </p>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Project Budget (USD)
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