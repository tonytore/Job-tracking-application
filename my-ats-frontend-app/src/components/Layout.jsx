// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({
  children,
  currentPage,
  navigateTo,
  currentUser,
  handleLogout,
  toggleSidebar,
  isSidebarOpen,
  message,
  handleGlobalSearch,
  globalSearchQuery,
}) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header
          currentPage={currentPage}
          navigateTo={navigateTo}
          currentUser={currentUser}
          handleLogout={handleLogout}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          handleGlobalSearch={handleGlobalSearch}
          globalSearchQuery={globalSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {message && (
            <div className={`p-3 mb-4 rounded-md text-center text-sm
                             ${message.includes('success') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
              role={message.includes('success') ? "status" : "alert"}
            >
              {message}
            </div>
          )}
          {children}
        </main>

        <Footer
          navigateTo={navigateTo}
          currentUser={currentUser}
          onLogout={handleLogout} // Ensure this prop name matches
        />
      </div>
    </div>
  );
};

export default Layout;