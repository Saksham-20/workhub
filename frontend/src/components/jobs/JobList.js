import React from 'react';
import JobCard from './JobCard';
import Loading from '../common/Loading';

const JobList = ({ jobs, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center">
        <p className="font-medium">Error loading jobs</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
        </p>
        
        {/* Sort dropdown - could be enhanced */}
        <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="newest">Newest First</option>
          <option value="budget-high">Highest Budget</option>
          <option value="budget-low">Lowest Budget</option>
          <option value="proposals">Most Proposals</option>
        </select>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination placeholder - could be added later */}
      {jobs.length >= 20 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md">
              1
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;