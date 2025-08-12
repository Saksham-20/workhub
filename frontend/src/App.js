import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './components/jobs/JobDetail';
import PostJob from './components/jobs/PostJob';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/browse-jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;