// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  currentPage,
  navigateTo,
  currentUser,
  handleLogout,
  toggleSidebar,
  isSidebarOpen,
  message,
  children, // This prop will be the actual page content
  // NEW: Receive global search props from App
  handleGlobalSearch,
  globalSearchQuery
}) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      {/* Sidebar Component */}
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        {/* Header Component */}
        <Header
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
          handleLogout={handleLogout}
          navigateTo={navigateTo}
          // NEW: Pass global search props to Header
          handleGlobalSearch={handleGlobalSearch}
          globalSearchQuery={globalSearchQuery}
        />

        {/* Global Message Display */}
        {message && (
          <div className="w-full max-w-4xl p-3 mb-4 rounded-md text-sm text-center bg-blue-100 text-blue-700 shadow-md">
            {message}
          </div>
        )}

        {/* Main content area for pages */}
        <main className="w-full max-w-6xl pt-12 flex justify-center items-center flex-grow">
          {children}
        </main>

        <Footer navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Layout;