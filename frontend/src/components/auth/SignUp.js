import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <select
                id="role"
                name="role"
                className="input-field mt-1"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="freelancer">Work as a Freelancer</option>
                <option value="client">Hire Freelancers</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
            🎯 Try Demo Accounts First
          </h3>
          <p className="text-sm text-blue-700 mb-4 text-center">
            Experience WorkHub with pre-configured demo accounts
          </p>
          
          <div className="space-y-3">
            {/* Freelancer Demo */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">👩‍💻 Freelancer Demo</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Sarah Johnson
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Email:</strong> sarah.demo@workhub.com</div>
                <div><strong>Password:</strong> demo123</div>
                <div className="text-xs text-gray-500">
                  Senior Full-Stack Developer • ₹75/hr
                </div>
              </div>
            </div>

            {/* Client Demo */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">👨‍💼 Client Demo</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Michael Chen
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Email:</strong> michael.demo@workhub.com</div>
                <div><strong>Password:</strong> demo123</div>
                <div className="text-xs text-gray-500">
                  CEO & Founder • InnovateTech
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Demo Accounts
            </Link>
          </div>

          <div className="mt-3 text-xs text-blue-600 text-center">
            💡 Demo accounts have complete profiles and sample data
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;