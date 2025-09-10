import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/jobs/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Jobs</h3>
          <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Jobs</h3>
          <p className="text-3xl font-bold text-green-600">
            {jobs.filter(job => job.status === 'open').length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Proposals</h3>
          <p className="text-3xl font-bold text-blue-600">
            {jobs.reduce((sum, job) => sum + (job.proposal_count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/post-job" className="btn-primary">
            Post a New Job
          </Link>
          <Link to="/browse-freelancers" className="btn-secondary">
            Browse Freelancers
          </Link>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Jobs</h2>
          <Link to="/post-job" className="text-primary-600 hover:text-primary-700 font-medium">
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
            <Link to="/post-job" className="btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Posted {formatDate(job.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatBudget(job.budget)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                      job.status === 'open' 
                        ? 'bg-green-100 text-green-800'
                        : job.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {job.proposal_count || 0} proposals
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;