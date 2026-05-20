import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900/80 border-t border-gray-800 backdrop-blur-xl mt-auto py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-orange-500 font-bold text-lg">RS&CO Tracking System</h3>
          <p className="text-sm text-gray-400 mt-1">Enterprise platform for RMC & Hotmix management.</p>
        </div>
        
        <div className="text-center md:text-right">
          <h4 className="text-gray-300 font-semibold mb-1">Proprietor Details</h4>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 mr-2">Name:</span> [Proprietor Name]
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 mr-2">Email:</span> [proprietor@email.com]
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 mr-2">Phone:</span> [+91-9876543210]
          </p>
        </div>
      </div>
    </footer>
  );
}
