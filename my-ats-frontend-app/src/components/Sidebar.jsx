import React from 'react';
import MesobLogo from './MesobLogo'; // Assuming MesobLogo.jsx is in the same directory

const Sidebar = ({
  currentPage,
  navigateTo,
  currentUser,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const navItems = [
    {
      name: 'Home',
      page: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      )
    },
    {
      name: 'Browse All Jobs', // NEW ITEM: Publicly accessible job listings
      page: 'jobListings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.593 23.593 0 0112 15c-3.183 0-6.22-1.28-8.455-3.245M12 12V3"></path></svg>
      )
    },
    // The "Apply for Job" link is commented out as it's typically initiated from a specific job card.
    // If you need a generic "Apply" button in the sidebar, it would lead to a page where a job is selected.
    /*
    {
      name: 'Apply for Job',
      page: 'apply',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      )
    },
    */
    {
      name: 'Create Job Posting',
      page: 'createJob',
      authRequired: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )
    },
    {
      name: 'View My Applications', // Changed text for clarity
      page: 'viewApplications',
      authRequired: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
      )
    },
    {
      name: 'Job Analytics',
      page: 'analytics',
      authRequired: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
      )
    },
  ];

  return (
    <>
      {/* Overlay for when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white w-64 p-6 flex flex-col shadow-xl z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:shadow-none lg:w-1/4`}
      >
        {/* Sidebar Header (Logo and Close Button) */}
        <div className="flex items-center justify-between mb-8 pt-20">
          {/* Clickable MesobLogo */}
          <div onClick={() => { navigateTo('/'); toggleSidebar(); }} className="cursor-pointer">
            <MesobLogo size="small" />
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow space-y-2">
          {navItems.map((item) => {
            // Conditionally render based on authentication status
            if (item.authRequired && !currentUser) {
              return null;
            }
            return (
              <button
                key={item.page}
                onClick={() => { navigateTo(item.page); toggleSidebar(); }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-medium cursor-pointer
                            transition duration-200 ease-in-out
                            ${currentPage === item.page
                    ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;