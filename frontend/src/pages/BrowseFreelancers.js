import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileService from '../services/profileService';
import Loading from '../components/common/Loading';
import { COMMON_SKILLS } from '../utils/constants';

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skills: '',
    customSkill: '',
    minRate: '',
    maxRate: '',
    experience_level: '',
    location: ''
  });

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Handle custom skill - if custom skill is provided, use it instead of skills
      const skillToSearch = filters.customSkill || filters.skills;
      if (skillToSearch) {
        params.append('skills', skillToSearch);
      }
      
      // Add other filters (excluding skills and customSkill)
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'skills' && key !== 'customSkill') {
          params.append(key, value);
        }
      });
      
      const response = await ProfileService.searchFreelancers(params);
      setFreelancers(response.freelancers || []);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      skills: '',
      customSkill: '',
      minRate: '',
      maxRate: '',
      experience_level: '',
      location: ''
    });
    setTimeout(fetchFreelancers, 0);
  };

  const FreelancerCard = ({ freelancer }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={freelancer.profile_picture || '/default-avatar.png'}
          alt={freelancer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {freelancer.name}
            </h3>
            {freelancer.hourly_rate && (
              <span className="text-lg font-bold text-green-600">
                ₹{freelancer.hourly_rate}/hr
              </span>
            )}
          </div>
          
          {freelancer.title && (
            <p className="text-sm text-gray-600 mt-1">{freelancer.title}</p>
          )}
          
          {freelancer.location && (
            <p className="text-sm text-gray-500 mt-1">📍 {freelancer.location}</p>
          )}
          
          {freelancer.experience_level && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
              {freelancer.experience_level}
            </span>
          )}
          
          {freelancer.bio && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {freelancer.bio}
            </p>
          )}
          
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {freelancer.skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {freelancer.skills.length > 5 && (
                  <span className="text-xs text-gray-500">
                    +{freelancer.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <Link
              to={`/profile/${freelancer.id}`}
              className="btn-primary text-sm"
            >
              View Profile
            </Link>
            <button className="btn-secondary text-sm">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Freelancers</h1>
        <p className="text-gray-600 mt-2">
          Find skilled professionals for your projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name or skills..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <select
                id="skills"
                name="skills"
                value={filters.skills}
                onChange={(e) => {
                  handleFilterChange(e);
                  // Clear custom skill when selecting from dropdown
                  if (e.target.value && e.target.value !== 'custom') {
                    setFilters(prev => ({ ...prev, customSkill: '' }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Skills</option>
                {COMMON_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
                <option value="custom">Custom Skill</option>
              </select>
            </div>
            
            {filters.skills === 'custom' && (
              <div>
                <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Custom Skill
                </label>
                <input
                  type="text"
                  id="customSkill"
                  name="customSkill"
                  value={filters.customSkill}
                  onChange={handleFilterChange}
                  placeholder="e.g., Machine Learning, Blockchain, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experience_level"
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="minRate" className="block text-sm font-medium text-gray-700 mb-1">
                Min Rate (₹/hr)
              </label>
              <input
                type="number"
                id="minRate"
                name="minRate"
                value={filters.minRate}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 mb-1">
                Max Rate (₹/hr)
              </label>
              <input
                type="number"
                id="maxRate"
                name="maxRate"
                value={filters.maxRate}
                onChange={handleFilterChange}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {freelancers.length} Freelancer{freelancers.length !== 1 ? 's' : ''} Found
            {filters.customSkill && (
              <span className="ml-2 text-sm font-normal text-green-600">
                (filtered by custom skill: "{filters.customSkill}")
              </span>
            )}
          </h2>
        </div>
      </div>

      {freelancers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No freelancers found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or browse all freelancers.
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Show All Freelancers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseFreelancers;
