import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Find the perfect</span>{' '}
                  <span className="block text-primary-600 xl:inline">freelance talent</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  WorkHub connects businesses with skilled freelancers from around the world. 
                  Get quality work done quickly and efficiently.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {user ? (
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/signup"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                        >
                          Get Started
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/browse-jobs"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                        >
                          Browse Jobs
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Join 10,000+ Users</h2>
              <p className="text-xl opacity-90">Trusted by businesses worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Section */}
      {!user && (
        <div className="bg-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                🎯 Try WorkHub with Demo Accounts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience all features with pre-configured demo accounts. No setup required!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Freelancer Demo */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">👩‍💻</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Freelancer Demo</h3>
                    <p className="text-sm text-gray-600">Sarah Johnson</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">sarah.demo@workhub.com</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Password:</span>
                    <span className="ml-2 text-gray-600">demo123</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Senior Full-Stack Developer • ₹75/hr • San Francisco
                  </div>
                </div>
                
                <Link
                  to="/login"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center block"
                >
                  Try Freelancer Demo
                </Link>
              </div>

              {/* Client Demo */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">👨‍💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Client Demo</h3>
                    <p className="text-sm text-gray-600">Michael Chen</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">michael.demo@workhub.com</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Password:</span>
                    <span className="ml-2 text-gray-600">demo123</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    CEO & Founder • InnovateTech • New York
                  </div>
                </div>
                
                <Link
                  to="/login"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                >
                  Try Client Demo
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-blue-600">
                💡 Demo accounts include complete profiles, sample jobs, and proposals
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Find Quality Talent</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Access a global pool of skilled freelancers ready to work on your projects.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Payments</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Safe and secure payment processing with milestone-based payments.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Easy Communication</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Built-in messaging and collaboration tools to keep projects on track.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Quality Assurance</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Review system and quality guarantees ensure you get the best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Join WorkHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Whether you're looking to hire talent or find work, WorkHub has everything you need.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;