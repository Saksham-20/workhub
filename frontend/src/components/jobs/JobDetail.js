import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ProposalForm from './ProposalForm';
import Loading from '../common/Loading';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [showCounterBidForm, setShowCounterBidForm] = useState(null);
  const [counterBidData, setCounterBidData] = useState({
    amount: '',
    message: ''
  });

  useEffect(() => {
    fetchJobDetails();
    if (user?.role === 'client') {
      fetchProposals();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await api.get(`/proposals/job/${id}`);
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    try {
      setProposalLoading(true);
      
      await api.put(`/proposals/${proposalId}`, { status: action });
      
      // Refresh proposals after action
      await fetchProposals();
      
      // Show success message
      alert(`Proposal ${action} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing proposal:`, error);
      alert(`Failed to ${action} proposal. Please try again.`);
    } finally {
      setProposalLoading(false);
    }
  };

  const handleCounterBidSubmit = async (proposalId) => {
    try {
      setProposalLoading(true);
      
      if (!counterBidData.amount || parseFloat(counterBidData.amount) <= 0) {
        alert('Please enter a valid counter bid amount');
        return;
      }

      await api.post('/proposals/counter-bids', {
        proposalId: proposalId,
        counterAmount: parseFloat(counterBidData.amount),
        message: counterBidData.message
      });

      // Reset form and close
      setCounterBidData({ amount: '', message: '' });
      setShowCounterBidForm(null);
      
      // Refresh proposals
      await fetchProposals();
      
      alert('Counter bid sent successfully!');
    } catch (error) {
      console.error('Error sending counter bid:', error);
      alert('Failed to send counter bid. Please try again.');
    } finally {
      setProposalLoading(false);
    }
  };

  const handleProposalSubmitted = () => {
    setShowProposalForm(false);
    if (user?.role === 'client') {
      fetchProposals();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatTimeline = (timeline) => {
    if (!timeline) return null;
    
    const timelineMap = {
      'less-than-1-month': 'Less than 1 month',
      '1-3-months': '1-3 months',
      'less-than-6-months': 'Less than 6 months',
      'more-than-6-months': 'More than 6 months'
    };
    
    return timelineMap[timeline] || timeline;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <p className="text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
          <Link to="/browse-jobs" className="btn-primary mt-4 inline-block">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isJobOwner = user?.id === job.client_id;
  const canSubmitProposal = user?.role === 'freelancer' && !isJobOwner && job.status === 'open';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/browse-jobs" className="text-primary-600 hover:text-primary-700">
          ← Back to Jobs
        </Link>
      </div>

      {/* Job Details Card */}
      <div className="card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600">
              Posted by {job.client_name} • {formatDate(job.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600 mb-1">
              {formatBudget(job.budget)}
            </p>
            <p className="text-sm text-gray-500">
              {job.proposal_count} proposals
            </p>
            {job.timeline && (
              <p className="text-sm text-blue-600 mt-1">
                📅 {formatTimeline(job.timeline)}
              </p>
            )}
            <span className={`inline-block px-3 py-1 text-sm rounded-md mt-2 ${
              job.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {canSubmitProposal && (
          <div className="border-t pt-6">
            {!showProposalForm ? (
              <button
                onClick={() => setShowProposalForm(true)}
                className="btn-primary"
              >
                Submit a Proposal
              </button>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Proposal</h3>
                <ProposalForm
                  jobId={job.id}
                  onSuccess={handleProposalSubmitted}
                  onCancel={() => setShowProposalForm(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Proposals Section with Counter Bid */}
      {isJobOwner && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Proposals ({proposals.length})
            </h2>
            <div className="text-sm text-gray-500">
              {proposals.filter(p => p.status === 'pending').length} pending
            </div>
          </div>
          
          {proposals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No proposals yet.</p>
              <p className="text-gray-400 text-sm mt-1">Freelancers will see your job and submit proposals.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map(proposal => (
                <div key={proposal.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Proposal Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {proposal.freelancer_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {proposal.freelancer_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {proposal.freelancer_email}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Submitted {formatDate(proposal.created_at)}
                      </p>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-green-600">
                          {formatBudget(proposal.bid_amount)}
                        </p>
                        {proposal.has_counter_bid && (
                          <p className="text-sm text-orange-600 font-medium">
                            Counter: {formatBudget(proposal.latest_counter_amount)}
                          </p>
                        )}
                      </div>
                      <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium mt-2 ${
                        proposal.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : proposal.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : proposal.status === 'countered'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {proposal.cover_letter}
                      </p>
                    </div>
                  </div>

                  {/* Counter Bid Form */}
                  {showCounterBidForm === proposal.id && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">Send Counter Offer</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Counter Amount (INR)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="Enter your counter offer"
                            value={counterBidData.amount}
                            onChange={(e) => setCounterBidData({...counterBidData, amount: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message (Optional)
                          </label>
                          <textarea
                            rows="3"
                            placeholder="Explain your counter offer..."
                            value={counterBidData.message}
                            onChange={(e) => setCounterBidData({...counterBidData, message: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCounterBidSubmit(proposal.id)}
                            disabled={proposalLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {proposalLoading ? 'Sending...' : 'Send Counter Offer'}
                          </button>
                          <button
                            onClick={() => setShowCounterBidForm(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {proposal.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'accepted')}
                        disabled={proposalLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {proposalLoading ? 'Processing...' : 'Accept Proposal'}
                      </button>
                      <button
                        onClick={() => setShowCounterBidForm(proposal.id)}
                        disabled={proposalLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Counter Offer
                      </button>
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'rejected')}
                        disabled={proposalLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {proposalLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}

                  {/* Contact Information for Accepted Proposals */}
                  {proposal.status === 'accepted' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✅ Proposal Accepted</h4>
                      <p className="text-green-700 text-sm">
                        You can now contact {proposal.freelancer_name} at{' '}
                        <a href={`mailto:${proposal.freelancer_email}`} className="underline">
                          {proposal.freelancer_email}
                        </a>
                      </p>
                    </div>
                  )}

                  {/* Counter Offer Status */}
                  {proposal.status === 'countered' && (
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">🔄 Counter Offer Sent</h4>
                      <p className="text-orange-700 text-sm">
                        Waiting for {proposal.freelancer_name} to respond to your counter offer of {formatBudget(proposal.latest_counter_amount)}.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Proposal Statistics */}
          {proposals.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBudget(Math.min(...proposals.map(p => p.bid_amount)))}
                  </p>
                  <p className="text-sm text-gray-500">Lowest Bid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBudget(proposals.reduce((sum, p) => sum + p.bid_amount, 0) / proposals.length)}
                  </p>
                  <p className="text-sm text-gray-500">Average Bid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBudget(Math.max(...proposals.map(p => p.bid_amount)))}
                  </p>
                  <p className="text-sm text-gray-500">Highest Bid</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;