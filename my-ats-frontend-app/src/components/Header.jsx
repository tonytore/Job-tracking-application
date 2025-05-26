// src/components/Header.jsx

import React from 'react'; // Removed useState, useEffect as not needed internally

const Header = ({ toggleSidebar, currentUser, handleLogout, navigateTo, handleGlobalSearch, globalSearchQuery }) => {

  const handleSearchChange = (e) => {
    handleGlobalSearch(e.target.value); // Update global state directly
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The handleGlobalSearch is already called on every change,
    // this submit is mainly for UX (pressing Enter) and to ensure navigation if not on job listings
    handleGlobalSearch(globalSearchQuery);
  };

  const handleClearSearch = () => {
    handleGlobalSearch(''); // Clear global search directly
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg h-20 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <h1 className="text-3xl font-extrabold text-indigo-700 cursor-pointer" onClick={() => navigateTo('/')}>Job Portal</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4 hidden sm:flex items-center relative">
          <input
            type="text"
            placeholder="Search jobs..."
            value={globalSearchQuery} // Controlled by global state
            onChange={handleSearchChange} // Updates global state directly
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
          />
          <div className="absolute left-3 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          {globalSearchQuery && ( // Check globalSearchQuery directly
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          )}
        </form>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-gray-700 text-sm font-medium hidden md:block">
                Welcome, {currentUser.email.split('@')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('login')}
                className="px-3 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-indigo-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hidden md:block cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;