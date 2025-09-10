import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);
    
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
            🎯 Demo Accounts
          </h3>
          <p className="text-sm text-blue-700 mb-4 text-center">
            Try WorkHub with these demo accounts to see all features
          </p>
          
          <div className="space-y-4">
            {/* Freelancer Demo */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">👩‍💻 Freelancer Demo</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Sarah Johnson
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Email:</strong> sarah.demo@workhub.com</div>
                <div><strong>Password:</strong> demo123</div>
                <div className="text-xs text-gray-500 mt-1">
                  Senior Full-Stack Developer • ₹75/hr • San Francisco
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ email: 'sarah.demo@workhub.com', password: 'demo123' })}
                className="mt-2 w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Use This Account
              </button>
            </div>

            {/* Client Demo */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">👨‍💼 Client Demo</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Michael Chen
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Email:</strong> michael.demo@workhub.com</div>
                <div><strong>Password:</strong> demo123</div>
                <div className="text-xs text-gray-500 mt-1">
                  CEO & Founder • InnovateTech • New York
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ email: 'michael.demo@workhub.com', password: 'demo123' })}
                className="mt-2 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Use This Account
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-blue-600 text-center">
            💡 Click "Use This Account" to auto-fill credentials, then click "Sign In"
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;