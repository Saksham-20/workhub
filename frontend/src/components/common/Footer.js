import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">WorkHub</h3>
            <p className="text-gray-300 text-sm">
              Connect talented freelancers with clients looking for quality work.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Post a Job</a></li>
              <li><a href="#" className="hover:text-white">Browse Freelancers</a></li>
              <li><a href="#" className="hover:text-white">Client Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Find Work</a></li>
              <li><a href="#" className="hover:text-white">Freelancer Guide</a></li>
              <li><a href="#" className="hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 WorkHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;