import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';

const FreelancerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await api.get('/jobs/my-jobs');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.proposal_status === 'pending');
  const acceptedApplications = applications.filter(app => app.proposal_status === 'accepted');

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-primary-600">{applications.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingApplications.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Accepted</h3>
          <p className="text-3xl font-bold text-green-600">{acceptedApplications.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/browse-jobs" className="btn-primary">
            Find New Jobs
          </Link>
          <Link to="/browse-jobs" className="btn-secondary">
            Update Profile
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
          <Link to="/browse-jobs" className="text-primary-600 hover:text-primary-700 font-medium">
            Browse More Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
            <Link to="/browse-jobs" className="btn-primary">
              Find Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      to={`/jobs/${application.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {application.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Applied {formatDate(application.created_at)} • Client: {application.client_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 mb-1">
                      Your bid: {formatBudget(application.bid_amount)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                      application.proposal_status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.proposal_status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {application.proposal_status.charAt(0).toUpperCase() + application.proposal_status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {application.description}
                </p>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 font-medium mb-1">Your cover letter:</p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {application.cover_letter}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {application.skills?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{application.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Job budget: {formatBudget(application.budget)}
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

export default FreelancerDashboard;