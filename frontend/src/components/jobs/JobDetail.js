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

      {/* Proposals Section (for job owners) */}
      {isJobOwner && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Proposals ({proposals.length})
          </h2>
          
          {proposals.length === 0 ? (
            <p className="text-gray-500">No proposals yet.</p>
          ) : (
            <div className="space-y-4">
              {proposals.map(proposal => (
                <div key={proposal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {proposal.freelancer_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(proposal.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatBudget(proposal.bid_amount)}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                        proposal.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : proposal.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {proposal.cover_letter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;