import React, { useEffect, useState } from 'react';

// Re-using Spinner component for loading state
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-purple-500"
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

// Helper function to construct the correct file URL (re-used from ApplicationList)
const getFileUrl = (API_BASE_URL, fileName) => {
  const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL.replace('/api/v1', '') : API_BASE_URL;
  return `${baseUrl}/uploads/${fileName}`;
};


const JobApplicantsDetailPage = ({ API_BASE_URL, token, jobPostingId, navigateTo }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState('Loading Job Title...');

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/applications/job/${jobPostingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send JWT for authentication
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setApplicants(data);
        // Assuming all applications for the same job have the same jobPosting title
        if (data.length > 0 && data[0].jobPosting?.title) {
          setJobTitle(data[0].jobPosting.title);
        } else {
          // If no applications, try to fetch job title directly (optional, requires new backend endpoint)
          // For now, fallback to a generic title
          setJobTitle('Job Applicants');
        }
        console.log("Applicants for job fetched successfully:", data);
      } catch (err) {
        console.error("Error fetching job applicants:", err);
        setError('Failed to load applicants. Please ensure you are logged in and the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (token && jobPostingId) { // Only fetch if token and jobPostingId are available
      fetchApplicants();
    } else if (!jobPostingId) {
      setLoading(false);
      setError('No Job Posting ID provided. Please select a job from the analytics page.');
    } else { // No token
      setLoading(false);
      setError('You must be logged in to view job applicants.');
    }
  }, [API_BASE_URL, token, jobPostingId]); // Re-fetch when dependencies change

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
        <Spinner />
        <p className="ml-4 text-lg text-gray-600">Loading applicants for {jobTitle}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 font-semibold text-lg bg-red-50 rounded-lg mx-auto max-w-xl shadow-md">
        {error}
        <button
          onClick={() => navigateTo('analytics')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
        >
          Back to Analytics
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
        Applicants for: <span className="text-indigo-700">{jobTitle}</span>
      </h2>
      <button
        onClick={() => navigateTo('analytics')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ease-in-out"
      >
        &larr; Back to Analytics
      </button>

      {applicants.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-md">No applicants found for this job posting.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1  lg:grid-cols-2 gap-6 sm:gap-8">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden
                         transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl group"
            >
              {/* Profile Image in top-left corner, made circular, fancy, and interactive */}
              {app.profilePictureFileName && (
                <a
                  href={getFileUrl(API_BASE_URL, app.profilePictureFileName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-8 left-8 z-10 block cursor-pointer transform -translate-x-4 -translate-y-4
                             transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-x-6 group-hover:-translate-y-6"
                >
                  <img
                    src={getFileUrl(API_BASE_URL, app.profilePictureFileName)}
                    alt="Applicant Profile"
                    className="w-28 h-28 object-cover rounded-full border-4 border-purple-400 shadow-xl"
                  />
                </a>
              )}
              <div className={app.profilePictureFileName ? "pl-24 pt-10 sm:pl-32 sm:pt-16" : ""}> {/* Adjusted padding responsively */}
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-2 leading-tight">
                  {app.applicant?.firstName} {app.applicant?.lastName}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-1">
                  <span className="font-medium text-gray-800">Email:</span> {app.applicant?.email}
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-1">
                  <span className="font-medium text-gray-800">Experience:</span> {app.yearsOfExperience} years
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-1">
                  <span className="font-medium text-gray-800">Education:</span> {app.highestEducation}
                </p>

                {/* File Links Section */}
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
                  {app.cvFileName && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">CV:</p>
                      <a
                        href={getFileUrl(API_BASE_URL, app.cvFileName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-purple-100 text-purple-800
                                   hover:bg-purple-200 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        View CV
                      </a>
                    </div>
                  )}

                  {app.coverLetterFileName && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Cover Letter (File):</p>
                      <a
                        href={getFileUrl(API_BASE_URL, app.coverLetterFileName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-purple-100 text-purple-800
                                   hover:bg-purple-200 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        View Cover Letter
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-right border-t border-gray-100 pt-4">
                Applied on: {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsDetailPage;
