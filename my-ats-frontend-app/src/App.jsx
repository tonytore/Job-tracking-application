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

// Define UserRole enum locally for frontend logic (should match backend)
const UserRole = {
  APPLICANT: 'APPLICANT',
  RECRUITER: 'RECRUITER',
  ADMIN: 'ADMIN',
};

// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    // Initial page load, default to '/'
    // We'll set the *actual* initial page based on role in the first useEffect
    return '/';
  });
  const [selectedJobId, setSelectedJobId] = useState(() => {
    const storedJobId = localStorage.getItem('selectedJobId');
    return storedJobId ? storedJobId : null;
  });

  const [currentUser, setCurrentUser] = useState(null); // Will now store { id, email, role }
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for global search query (used by Header for live filter)
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  // NEW: State for Home page specific search query (typed, then submitted)
  const [homePageSearchInput, setHomePageSearchInput] = useState('');


  const API_BASE_URL = 'http://localhost:3000/api/v1';

  // Effect for initial load and session check
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUserRole = localStorage.getItem('userRole'); // Read user role from localStorage

    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        const userLoadedRole = storedUserRole || decoded.role || UserRole.APPLICANT; // Fallback

        setCurrentUser({ id: decoded.id, email: decoded.email, role: userLoadedRole });

        // IMPORTANT: Set initial page based on loaded role
        if (userLoadedRole === UserRole.ADMIN) {
          setCurrentPage('analytics'); // Admin sees analytics first
        } else {
          setCurrentPage('/'); // Applicant/Recruiter see home first
        }

      } catch (e) {
        console.error("Failed to decode stored token or user role:", e);
        // Clear invalid session data
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('lastPage'); // Clear previous page if session is bad
        setToken(null);
        setCurrentUser(null);
        setCurrentPage('/'); // Go to home if session is invalid
      }
    } else {
      // If no token, ensure we are on a public page or default to home
      const lastPage = localStorage.getItem('lastPage');
      if (lastPage && ['/', 'jobListings', 'login', 'register'].includes(lastPage)) {
        setCurrentPage(lastPage);
      } else {
        setCurrentPage('/');
      }
    }

  }, []); // Empty dependency array means this runs only once on mount

  // Separate useEffect to handle `currentPage` updates in localStorage
  useEffect(() => {
    localStorage.setItem('lastPage', currentPage);
  }, [currentPage]);

  // Effect for selectedJobId in localStorage
  useEffect(() => {
    if (selectedJobId) {
      localStorage.setItem('selectedJobId', selectedJobId);
    } else {
      localStorage.removeItem('selectedJobId');
    }
  }, [selectedJobId]);


  const handleLoginSuccess = (user, receivedToken) => {
    setToken(receivedToken);

    let decodedRole = UserRole.APPLICANT; // Default to applicant if role isn't found
    let userId = user.id;
    let userEmail = user.email;

    try {
      // Decode the token payload to get the role (and potentially ID/email if not in user object)
      const decodedToken = JSON.parse(atob(receivedToken.split('.')[1]));
      decodedRole = decodedToken.role || UserRole.APPLICANT;
      // Also ensure ID/email are from token if user object didn't provide them fully
      userId = userId || decodedToken.id;
      userEmail = userEmail || decodedToken.email;

    } catch (e) {
      console.error("Failed to decode token on login success:", e);
      // You might want to display an error message to the user here
    }

    // Create a complete user object with the role derived from the token
    const fullUser = { id: userId, email: userEmail, role: decodedRole };
    setCurrentUser(fullUser);

    // Store token and role in localStorage for persistent session
    localStorage.setItem('jwtToken', receivedToken);
    localStorage.setItem('userRole', decodedRole); // Store role explicitly for easier access on reload

    setMessage(`Welcome back, ${fullUser.email}! You are logged in as a ${fullUser.role.toLowerCase()}.`);

    // IMPORTANT: Set initial page based on newly logged-in user's role
    if (fullUser.role === UserRole.ADMIN) {
      console.log("Admin login detected. Navigating to analytics."); // Debugging log
      setCurrentPage('analytics'); // Admin goes to analytics
    } else {
      console.log(`Non-admin login detected. Role: ${fullUser.role}. Navigating to home.`); // Debugging log
      setCurrentPage('/'); // Applicant/Recruiter go to home
    }
    // Close sidebar on login success if it's open (for mobile)
    if (window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleRegisterSuccess = () => {
    setMessage('Registration successful! You can now log in.');
    setCurrentPage('login');
    // Close sidebar on register success (for mobile)
    if (window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole'); // Clear user role on logout
    localStorage.removeItem('lastPage');
    localStorage.removeItem('selectedJobId');
    setCurrentUser(null);
    setToken(null);
    setMessage('You have been logged out.');
    setCurrentPage('/'); // Always go to home after logout
    setSelectedJobId(null);
    setGlobalSearchQuery(''); // Clear search on logout
    setHomePageSearchInput(''); // Also clear Home page input
    // Ensure sidebar is closed on logout
    setIsSidebarOpen(false);
  };

  // This function is for the Header's search input (live filtering)
  const handleHeaderSearchChange = (query) => {
    setGlobalSearchQuery(query);
    // If we're on the home page and start typing in the HEADER, we navigate to listings.
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
    setMessage(''); // Clear any previous messages

    // --- Role-based navigation restrictions ---
    // Note: The components themselves also have conditional rendering based on role,
    // which acts as a second layer of defense.
    if (currentUser) {
      const userRole = currentUser.role;
      if (
        (page === 'createJob' && !(userRole === UserRole.RECRUITER || userRole === UserRole.ADMIN)) ||
        (page === 'jobApplicants' && !(userRole === UserRole.RECRUITER || userRole === UserRole.ADMIN)) ||
        (page === 'analytics' && !(userRole === UserRole.ADMIN || userRole === UserRole.RECRUITER))
      ) {
        setMessage('Access denied: You do not have permission to view this page.');
        return; // Prevent navigation
      }
      // 'viewApplications' is accessible to APPLICANT, RECRUITER, ADMIN (if they have applications)
      // So no specific restriction here other than being logged in.
    } else {
      // If not logged in, restrict access to any authenticated page
      if (['createJob', 'viewApplications', 'analytics', 'jobApplicants'].includes(page)) {
        setMessage('Please log in to access this feature.');
        return; // Prevent navigation
      }
    }

    setCurrentPage(page);
    setSelectedJobId(jobId);

    // Clear global search query and Home page input if navigating to a page that's not a listing/search related
    if (page !== 'jobListings' && page !== 'viewApplications' && page !== 'home') {
      setGlobalSearchQuery('');
      setHomePageSearchInput('');
    }

    // Close sidebar on navigation for smaller screens
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <Layout
      currentPage={currentPage}
      navigateTo={navigateTo}
      currentUser={currentUser} // This now includes the role
      handleLogout={handleLogout}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      message={message}
      // Pass the header-specific search handler
      handleGlobalSearch={handleHeaderSearchChange}
      globalSearchQuery={globalSearchQuery}
    >
      {/* Conditional Component Rendering based on roles */}
      {currentPage === '/' && (
        <HomePage
          navigateTo={navigateTo}
          handleHomePageSearchSubmit={handleHomePageSearchSubmit}
          homePageSearchInput={homePageSearchInput}
          setHomePageSearchInput={setHomePageSearchInput}
        />
      )}
      {/* JobListingPage accessible to all */}
      {currentPage === 'jobListings' && (
        <JobListingPage API_BASE_URL={API_BASE_URL} token={token} navigateTo={navigateTo} searchQuery={globalSearchQuery} currentUser={currentUser} />
      )}
      {/* Apply for Job: Only accessible to authenticated users (APPLICANT, RECRUITER, ADMIN can apply if they wish) */}
      {currentPage === 'apply' && selectedJobId && (
        <JobApplicationForm API_BASE_URL={API_BASE_URL} selectedJobId={selectedJobId} navigateTo={navigateTo} />
      )}
      {/* Create Job Posting: Only for RECRUITER or ADMIN */}
      {currentPage === 'createJob' && currentUser && (currentUser.role === UserRole.RECRUITER || currentUser.role === UserRole.ADMIN) && (
        <JobPostingForm API_BASE_URL={API_BASE_URL} token={token} navigateTo={navigateTo} />
      )}
      {/* View My Applications: For APPLICANT. Recruiters/Admins can also view if they apply for jobs. */}
      {currentPage === 'viewApplications' && currentUser && (
        <ApplicationList API_BASE_URL={API_BASE_URL} token={token} searchQuery={globalSearchQuery} currentUser={currentUser} navigateTo={navigateTo} />
      )}
      {/* Job Analytics: Only for ADMIN */}
      {currentPage === 'analytics' && currentUser && (currentUser.role === UserRole.RECRUITER || currentUser.role === UserRole.ADMIN) && (
        <JobAnalyticsPage API_BASE_URL={API_BASE_URL} token={token} navigateTo={navigateTo} />
      )}
      {/* Job Applicants Detail: Only for RECRUITER or ADMIN, and a job must be selected */}
      {currentPage === 'jobApplicants' && currentUser && selectedJobId && (currentUser.role === UserRole.RECRUITER || currentUser.role === UserRole.ADMIN) && (
        <JobApplicantsDetailPage API_BASE_URL={API_BASE_URL} token={token} jobPostingId={selectedJobId} navigateTo={navigateTo} />
      )}
      {/* Register Form: Only if not logged in */}
      {currentPage === 'register' && !currentUser && (
        <RegisterForm API_BASE_URL={API_BASE_URL} onRegisterSuccess={handleRegisterSuccess} navigateTo={navigateTo} />
      )}
      {/* Login Form: Only if not logged in */}
      {currentPage === 'login' && !currentUser && (
        <LoginForm API_BASE_URL={API_BASE_URL} onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />
      )}
    </Layout>
  );
};

export default App;