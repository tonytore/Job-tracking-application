// src/components/RegisterForm.jsx

import React, { useState } from 'react';

const RegisterForm = ({ API_BASE_URL, onRegisterSuccess, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Registration successful
        setEmail('');
        setPassword('');
        if (onRegisterSuccess) {
          // You might still want a small delay or a simple alert here for user feedback
          // before navigating, but for simplicity, removing setTimeout.
          onRegisterSuccess();
        } else {
          navigateTo('login');
        }
      } else {
        // Registration failed, e.g., email already exists, invalid data
        const errorData = await response.json();
        alert(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      // Network error or other unexpected issues
      console.error('Error during registration:', error);
      alert('Failed to connect to the server. Please check your internet connection.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            id="registerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            id="registerPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
        >
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => navigateTo('login')}
          className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;