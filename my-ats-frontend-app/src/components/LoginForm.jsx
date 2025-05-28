// src/components/LoginForm.jsx
import React, { useState } from 'react';

// Centralized Spinner Component (can be moved to its own file if used more widely)
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- LoginForm Component ---
const LoginForm = ({ API_BASE_URL, onLoginSuccess, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setFeedbackMessage(result.message || 'Login successful!');
        setIsError(false);
        setEmail('');
        setPassword('');
        // Store the token and the user's role in localStorage
        localStorage.setItem('jwtToken', result.token);
        // Assuming result.user contains { id, email, role } from backend
        localStorage.setItem('userRole', result.user.role); // Store the role

        console.log('JWT Token stored:', result.token);
        console.log('User Role stored:', result.user.role);

        if (onLoginSuccess) {
          // Pass the user object including role to onLoginSuccess in App.jsx
          onLoginSuccess(result.user, result.token);
        }
      } else {
        setFeedbackMessage(result.message || 'Login failed. Please check your credentials.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Network or unexpected error during login:', error);
      setFeedbackMessage('Failed to connect to the server. Please check your internet connection.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Login</h2>
      {feedbackMessage && (
        <div
          className={`p-3 mb-4 rounded-md text-sm text-center ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
          role={isError ? "alert" : "status"}
        >
          {feedbackMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            id="loginEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? <><Spinner /><span className="ml-2">Logging in...</span></> : 'Login'}
        </button>
      </form>
      {/* Link to Register Page */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={() => navigateTo('register')}
          className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline cursor-pointer"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default LoginForm;