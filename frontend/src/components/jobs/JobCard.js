import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link 
            to={`/jobs/${job.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-primary-600"
          >
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Posted by {job.client_name} • {formatDate(job.created_at)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatBudget(job.budget)}
          </p>
          <p className="text-sm text-gray-500">
            {job.proposal_count} proposals
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 5).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-md"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 5 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            +{job.skills.length - 5} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 text-xs rounded-md ${
          job.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
        
        <Link
          to={`/jobs/${job.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;