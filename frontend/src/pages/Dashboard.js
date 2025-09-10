import React from 'react';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import FreelancerDashboard from '../components/dashboard/FreelancerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'client' 
            ? 'Manage your job postings and review proposals.' 
            : 'Find new opportunities and track your applications.'
          }
        </p>
      </div>

      {user?.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
    </div>
  );
};

export default Dashboard;