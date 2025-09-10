import React, { useState } from 'react';
import api from '../../services/api';

const ProposalForm = ({ jobId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    bidAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/proposals', {
        jobId: parseInt(jobId),
        coverLetter: formData.coverLetter,
        bidAmount: parseFloat(formData.bidAmount)
      });
      
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
          Your Bid Amount (INR)
        </label>
        <input
          type="number"
          id="bidAmount"
          name="bidAmount"
          required
          min="1"
          step="0.01"
          className="input-field"
          placeholder="Enter your bid amount"
          value={formData.bidAmount}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          required
          rows={6}
          className="input-field"
          placeholder="Explain why you're the best fit for this job..."
          value={formData.coverLetter}
          onChange={handleChange}
        />
        <p className="text-sm text-gray-500 mt-1">
          Introduce yourself and explain why you're perfect for this job.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Proposal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProposalForm;