import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';

const FreelancerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [counterBids, setCounterBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [counterBidLoading, setCounterBidLoading] = useState(false);

  useEffect(() => {
    fetchMyApplications();
    fetchCounterBids();
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

  const fetchCounterBids = async () => {
    try {
      const response = await api.get('/proposals/counter-bids/user');
      // Filter for received counter bids that are pending
      const receivedPending = response.data.filter(cb => 
        cb.direction === 'received' && cb.status === 'pending' && !cb.is_expired
      );
      setCounterBids(receivedPending);
    } catch (error) {
      console.error('Error fetching counter bids:', error);
    }
  };

  const handleCounterBidResponse = async (counterBidId, action, newAmount = null, message = '') => {
    try {
      setCounterBidLoading(true);
      
      const requestData = { action };
      if (action === 'counter' && newAmount) {
        requestData.newCounterAmount = parseFloat(newAmount);
        requestData.message = message;
      }

      await api.put(`/proposals/counter-bids/${counterBidId}`, requestData);
      
      // Refresh data
      await fetchCounterBids();
      await fetchMyApplications();
      
      alert(`Counter offer ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing counter bid:`, error);
      alert(`Failed to ${action} counter offer. Please try again.`);
    } finally {
      setCounterBidLoading(false);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Counter Offers</h3>
          <p className="text-3xl font-bold text-orange-600">{counterBids.length}</p>
        </div>
      </div>

      {/* Counter Bids Alert */}
      {counterBids.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>You have {counterBids.length} pending counter offer{counterBids.length !== 1 ? 's' : ''}!</strong> 
                {' '}Review and respond to negotiate better terms.
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('counter-bids')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'counter-bids'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Counter Offers ({counterBids.length})
              {counterBids.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  New
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
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
                            : application.proposal_status === 'countered'
                            ? 'bg-orange-100 text-orange-800'
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
        )}

        {/* Counter Bids Tab */}
        {activeTab === 'counter-bids' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Counter Offers</h2>
              <p className="text-sm text-gray-500">
                {counterBids.length} pending offer{counterBids.length !== 1 ? 's' : ''}
              </p>
            </div>

            {counterBids.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No pending counter offers</p>
                <p className="text-gray-400 text-sm mt-1">When clients send counter offers, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {counterBids.map(counterBid => (
                  <div key={counterBid.id} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {counterBid.job_title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Counter offer from {counterBid.from_user_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Received {formatDate(counterBid.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600 mb-1">
                          {formatBudget(counterBid.counter_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          vs your bid: {formatBudget(counterBid.job_budget)}
                        </p>
                      </div>
                    </div>

                    {counterBid.message && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Client's Message:</h4>
                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-gray-700 text-sm">
                            {counterBid.message}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCounterBidResponse(counterBid.id, 'accept')}
                        disabled={counterBidLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Accept {formatBudget(counterBid.counter_amount)}
                      </button>
                      <button
                        onClick={() => handleCounterBidResponse(counterBid.id, 'reject')}
                        disabled={counterBidLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Decline Offer
                      </button>
                      <button
                        onClick={() => {
                          const newAmount = prompt('Enter your counter amount:', counterBid.counter_amount);
                          const message = prompt('Optional message:') || '';
                          if (newAmount && parseFloat(newAmount) > 0) {
                            handleCounterBidResponse(counterBid.id, 'counter', newAmount, message);
                          }
                        }}
                        disabled={counterBidLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Counter Back
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      This offer expires {formatDate(counterBid.expires_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;