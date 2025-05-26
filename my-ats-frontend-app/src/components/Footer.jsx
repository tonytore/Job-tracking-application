// src/components/Footer.jsx
import React from 'react';

// Use 'onLogout' here to match how it's passed from Layout/App
const Footer = ({ navigateTo, currentUser, onLogout }) => {
  // Base button styles for consistency for the Login/Logout buttons
  // Retaining the consistent button styles as requested previously
  const baseAuthButtonClasses = "px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm font-semibold cursor-pointer";

  return (
    <footer className="w-full bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Section 1: About Us / Copyright */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-white mb-4">Job Portal</h3>
          <p className="text-sm leading-relaxed">
            Connecting talent with opportunity. We strive to make job searching and hiring efficient and effective for everyone.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigateTo('home')} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm cursor-pointer">Home</button>
            </li>
            <li>
              <button onClick={() => navigateTo('jobListings')} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm cursor-pointer">Browse Jobs</button>
            </li>
            {/* Conditional links for logged-in users (no role check) */}
            {currentUser && (
              <>
                {/* These links will now show for ANY logged-in user */}
                <li>
                  <button onClick={() => navigateTo('viewApplications')} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm cursor-pointer">My Applications</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('createJob')} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm cursor-pointer">Post a Job</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('analytics')} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm cursor-pointer">Analytics</button>
                </li>

              </>
            )}
          </ul>
        </div>

        {/* Section 3: Connect With Us */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            {/* Social media icons */}
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.715.056 1.025.045 1.785.19 2.404.465.66.289 1.229.664 1.785 1.229.56.556.935 1.125 1.229 1.785.275.619.42 1.379.465 2.404.043.93.056 1.286.056 3.715s-.013 2.784-.056 3.715c-.045 1.025-.19 1.785-.465 2.404-.289.66-.664 1.229-1.229 1.785-.556.56-.935 1.125-1.785 1.229-.619.275-1.379.42-2.404.465-.93.043-1.286.056-3.715.056s-2.784-.013-3.715-.056c-1.025-.045-1.785-.19-2.404-.465-.66-.289-1.229-.664-1.785-1.229-.56-.556-.935-1.125-1.229-1.785-.275-.619-.42-1.379-.465-2.404C3.646 16.315 3.633 15.96 3.633 12.315s.013-2.784.056-3.715c.045-1.025.19-1.785.465-2.404.289-.66.664-1.229 1.229-1.785.556-.56.935-1.125 1.785-1.229.619-.275 1.379-.42 2.404-.465C9.535 2.013 9.89 2 12.315 2zm0 0l-.017 1.004S9.89 3.017 8.865 3.06c-.84.037-1.47.16-1.99.38-.52.22-.973.53-1.38.93-.408.408-.71.86-.93 1.38-.22.52-.343 1.15-.38 1.99-.043 1.025-.056 1.286-.056 3.715s.013 2.784.056 3.715c.037.84.16 1.47.38 1.99.22.52.53.973.93 1.38.408.408.86.71 1.38.93.52.22 1.15.343 1.99.38 1.025.043 1.286.056 3.715.056s2.784-.013 3.715-.056c-.84-.037-.16-1.47-.38-1.99-.22-.52-.53-.973-.93-1.38-.408-.408-.71-.86-1.38-.93-.52-.22-1.15-.343-1.99-.38-1.025-.043-1.286-.056-3.715-.056zM12 9.535c-1.366 0-2.465 1.099-2.465 2.465S10.634 14.465 12 14.465s2.465-1.099 2.465-2.465S13.366 9.535 12 9.535zm0 1.004c.805 0 1.46.655 1.46 1.46s-.655 1.46-1.46 1.46-1.46-.655-1.46-1.46.655-1.46 1.46-1.46z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom section for copyright and conditional auth links */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-sm flex flex-col sm:flex-row justify-between items-center">
        <p className="text-center sm:text-left mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Job Portal. All rights reserved. Designed with <span className="text-red-500">&hearts;</span> using React & Tailwind CSS</p>
        {/* Login/Logout Button */}
        <div className="flex justify-center sm:justify-end">
          {currentUser ? (
            <button
              onClick={onLogout}
              className={`${baseAuthButtonClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className={`${baseAuthButtonClasses} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;