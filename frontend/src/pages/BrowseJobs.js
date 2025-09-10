import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import Loading from '../components/common/Loading';
import { COMMON_SKILLS } from '../utils/constants';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skills: '',
    minBudget: '',
    maxBudget: ''
  });
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim()) {
      setFilters(prev => ({
        ...prev,
        skills: customSkill.trim()
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      skills: '',
      minBudget: '',
      maxBudget: ''
    });
    setTimeout(fetchJobs, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
        
        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <select
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Skills</option>
                {COMMON_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
                <option value="custom">Custom Skill</option>
              </select>
              
              {filters.skills === 'custom' && (
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={handleCustomSkillKeyPress}
                      placeholder="Enter custom skill"
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
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget
              </label>
              <input
                type="number"
                name="minBudget"
                placeholder="0"
                value={filters.minBudget}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget
              </label>
              <input
                type="number"
                name="maxBudget"
                placeholder="No limit"
                value={filters.maxBudget}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn-primary">
              Search Jobs
            </button>
            <button type="button" onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {loading ? 'Loading...' : `${jobs.length} jobs found`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          <Link to="/post-job" className="btn-primary mt-4 inline-block">
            Post the First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;