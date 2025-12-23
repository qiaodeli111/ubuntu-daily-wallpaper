
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-black flex items-center gap-3">
          <span className="ubuntu-gradient w-12 h-12 rounded-xl flex items-center justify-center text-white">
            <i className="fab fa-ubuntu"></i>
          </span>
          Ubuntu <span className="text-[#E95420]">Daily</span>
        </h1>
        <p className="text-gray-400 mt-2 font-medium">Beautiful landscapes for your workspace, everyday.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-300">New Image Available</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
