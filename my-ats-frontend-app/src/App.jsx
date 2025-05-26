// src/App.jsx
import { useEffect, useState } from "react";
import HomePage from "./components/Home";
import JobApplicationForm from "./components/JobApplicationForm";
import JobPostingForm from "./components/JobPostingForm";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import JobAnalyticsPage from "./components/JobAnalyticsPage";
import JobApplicantsDetailPage from "./components/JobApplicantsDetailPage";
import ApplicationList from "./components/ApplicationList";
import JobListingPage from "./components/JobListingPage";

import Layout from "./components/Layout";


// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('lastPage');
    return storedPage ? storedPage : '/';
  });
  const [selectedJobId, setSelectedJobId] = useState(() => {
    const storedJobId = localStorage.getItem('selectedJobId');
    return storedJobId ? storedJobId : null;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for global search query (used by Header for live filter)
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  // NEW: State for Home page specific search query (typed, then submitted)
  const [homePageSearchInput, setHomePageSearchInput] = useState('');


  const API_BASE_URL = 'http://localhost:3000/api/v1';

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        setCurrentUser({ id: decoded.id, email: decoded.email });
      } catch (e) {
        console.error("Failed to decode stored token:", e);
        localStorage.removeItem('jwtToken');
        setToken(null);
        setCurrentUser(null);
      }
    }

    localStorage.setItem('lastPage', currentPage);
    if (selectedJobId) {
      localStorage.setItem('selectedJobId', selectedJobId);
    } else {
      localStorage.removeItem('selectedJobId');
    }

  }, [currentPage, selectedJobId]);

  const handleLoginSuccess = (user, receivedToken) => {
    setCurrentUser(user);
    setToken(receivedToken);
    setMessage(`Welcome back, ${user.email}!`);
    setCurrentPage('/');
  };

  const handleRegisterSuccess = () => {
    setMessage('Registration successful! You can now log in.');
    setCurrentPage('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('lastPage');
    localStorage.removeItem('selectedJobId');
    setCurrentUser(null);
    setToken(null);
    setMessage('You have been logged out.');
    setCurrentPage('/');
    setSelectedJobId(null);
    setGlobalSearchQuery(''); // Clear search on logout
    setHomePageSearchInput(''); // Also clear Home page input
  };

  // This function is for the Header's search input (live filtering)
  const handleHeaderSearchChange = (query) => {
    setGlobalSearchQuery(query);
    // If we're on a page where a global search makes sense (listings, applications),
    // and the query changes, we just let the page's useEffect handle the filter.
    // If we're on the home page and start typing in the HEADER, we navigate.
    if (currentPage === '/') {
      setCurrentPage('jobListings');
    }
  };

  // This function is specifically for the Home page's search input (submit-based navigation)
  const handleHomePageSearchSubmit = (query) => {
    setGlobalSearchQuery(query); // Set the global query with the full typed query
    setHomePageSearchInput(query); // Keep the input value for the current Home page search
    setCurrentPage('jobListings'); // Always navigate to job listings on submit
  };

  const navigateTo = (page, jobId = null) => {
    if ((page === 'createJob' || page === 'analytics' || page === 'jobApplicants' || page === 'viewApplications') && !currentUser) {
      setMessage('Please log in to access this feature.');
      return;
    }
    setMessage('');
    setCurrentPage(page);
    setSelectedJobId(jobId);

    // Clear global search query and Home page input if navigating to a page that's not a listing/search page
    // We *don't* clear if navigating between jobListings and viewApplications.
    // We also *don't* clear if navigating to home, as its own search input manages its state.
    if (page !== 'jobListings' && page !== 'viewApplications' && page !== '/') {
      setGlobalSearchQuery('');
      setHomePageSearchInput('');
    }
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <Layout
      currentPage={currentPage}
      navigateTo={navigateTo}
      currentUser={currentUser}
      handleLogout={handleLogout}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      message={message}
      // Pass the header-specific search handler
      handleGlobalSearch={handleHeaderSearchChange}
      globalSearchQuery={globalSearchQuery}
    >
      {/* Conditional Component Rendering */}
      {currentPage === '/' && (
        <HomePage
          navigateTo={navigateTo}
          // Pass the home page specific search handler and its input value
          handleHomePageSearchSubmit={handleHomePageSearchSubmit}
          homePageSearchInput={homePageSearchInput}
          setHomePageSearchInput={setHomePageSearchInput} // Allow Home to control its input
        />
      )}
      {/* JobListingPage accessible to all */}
      {currentPage === 'jobListings' && (
        <JobListingPage API_BASE_URL={API_BASE_URL} token={token} navigateTo={navigateTo} searchQuery={globalSearchQuery} />
      )}
      {currentPage === 'apply' && (
        <JobApplicationForm API_BASE_URL={API_BASE_URL} selectedJobId={selectedJobId} />
      )}
      {currentPage === 'createJob' && currentUser && (
        <JobPostingForm API_BASE_URL={API_BASE_URL} token={token} />
      )}
      {currentPage === 'viewApplications' && currentUser && (
        <ApplicationList API_BASE_URL={API_BASE_URL} token={token} searchQuery={globalSearchQuery} />
      )}
      {currentPage === 'analytics' && currentUser && (
        <JobAnalyticsPage API_BASE_URL={API_BASE_URL} token={token} navigateTo={navigateTo} />
      )}
      {currentPage === 'jobApplicants' && currentUser && selectedJobId && (
        <JobApplicantsDetailPage API_BASE_URL={API_BASE_URL} token={token} jobPostingId={selectedJobId} navigateTo={navigateTo} />
      )}
      {currentPage === 'register' && !currentUser && (
        <RegisterForm API_BASE_URL={API_BASE_URL} onRegisterSuccess={handleRegisterSuccess} navigateTo={navigateTo} />
      )}
      {currentPage === 'login' && !currentUser && (
        <LoginForm API_BASE_URL={API_BASE_URL} onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />
      )}
    </Layout>
  );
};

export default App;