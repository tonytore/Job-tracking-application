// src/components/JobApplicationForm.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const JobApplicationForm = ({ API_BASE_URL, selectedJobId, navigateTo }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [highestEducation, setHighestEducation] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null); // NEW: State for profile picture

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');

  // Fetch job details
  useEffect(() => {
    if (!selectedJobId) {
      setError("No job selected for application. Please select a job from the listings.");
      setLoading(false);
      return;
    }

    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobDetails(data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Could not load job details. Please try again or go back to job listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [selectedJobId, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplicationMessage('');

    if (!selectedJobId) {
      setApplicationMessage('Error: No specific job selected for application.');
      return;
    }

    if (!resumeFile) {
      setApplicationMessage('Please upload your resume to submit the application.');
      return;
    }

    const formData = new FormData();
    formData.append('jobPostingId', selectedJobId);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', applicantEmail);
    formData.append('yearsOfExperience', yearsOfExperience);
    formData.append('highestEducation', highestEducation);
    formData.append('coverLetter', coverLetter);
    formData.append('cvFile', resumeFile);
    if (profilePictureFile) { // Conditionally append if a file is selected
      formData.append('profilePictureFile', profilePictureFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setApplicationMessage('Application submitted successfully!');
        setFirstName('');
        setLastName('');
        setApplicantEmail('');
        setYearsOfExperience('');
        setHighestEducation('');
        setCoverLetter('');
        setResumeFile(null);
        setProfilePictureFile(null); // NEW: Clear profile picture input
        // Optionally navigate away
        // navigateTo('/jobListings');
      } else {
        const errorData = await response.json();
        setApplicationMessage(`Failed to submit application: ${errorData.message || 'Unknown error'}`);
        console.error("Backend error response:", errorData);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setApplicationMessage('An unexpected error occurred while submitting your application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 font-semibold">
        <p>{error}</p>
        <button
          onClick={() => navigateTo('jobListings')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Job Listings
        </button>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="text-center p-8 text-gray-600">
        <p>No job selected. Please browse available jobs to apply.</p>
        <button
          onClick={() => navigateTo('jobListings')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Apply for: <span className="text-indigo-600">{jobDetails.title}</span>
      </h1>
      {jobDetails.description && (
        <p className="text-gray-600 text-sm mb-4 border-b pb-4 italic">
          "{jobDetails.description}"
        </p>
      )}

      {applicationMessage && (
        <div className={`p-3 mb-4 rounded-md ${applicationMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {applicationMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="applicantEmail" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
          <input
            type="email"
            id="applicantEmail"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              id="yearsOfExperience"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="highestEducation" className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
            <select
              id="highestEducation"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={highestEducation}
              onChange={(e) => setHighestEducation(e.target.value)}
              required
            >
              <option value="">Select Education Level</option>
              <option value="High School">High School</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF, DOCX)</label>
          <input
            type="file"
            id="resumeFile"
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            required
          />
          {resumeFile && <p className="text-sm text-gray-500 mt-1">Selected: {resumeFile.name}</p>}
        </div>
        {/* NEW: Profile Picture Input */}
        <div>
          <label htmlFor="profilePictureFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture (Optional, JPG, PNG)</label>
          <input
            type="file"
            id="profilePictureFile"
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setProfilePictureFile(e.target.files[0])}
          />
          {profilePictureFile && <p className="text-sm text-gray-500 mt-1">Selected: {profilePictureFile.name}</p>}
        </div>
        {/* END NEW */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
          <textarea
            id="coverLetter"
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're a great fit for this role..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;