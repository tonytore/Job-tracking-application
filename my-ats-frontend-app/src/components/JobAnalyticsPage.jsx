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

const JobAnalyticsPage = ({ API_BASE_URL, token, navigateTo }) => { // Added navigateTo prop
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/analytics`, {
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
        setAnalyticsData(data);
        console.log("Job Analytics fetched successfully:", data);
      } catch (err) {
        console.error("Error fetching job analytics:", err);
        setError('Failed to load analytics. Please ensure you are logged in and the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Only fetch if a token is available (user is logged in)
      fetchAnalytics();
    } else {
      setLoading(false);
      setError('You must be logged in to view job analytics.');
    }
  }, [API_BASE_URL, token]); // Re-fetch when API_BASE_URL or token changes

  const handleCardClick = (jobId) => {
    // Navigate to the new applicants detail page, passing the job ID
    navigateTo('jobApplicants', jobId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
        <Spinner />
        <p className="ml-4 text-lg text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 font-semibold text-lg bg-red-50 rounded-lg mx-auto max-w-xl shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Job Posting Analytics</h2>

      {analyticsData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-md">No job postings found or no applicants yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {analyticsData.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden
                         transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer" // Added cursor-pointer
              onClick={() => handleCardClick(job.id)} // Added onClick handler
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-2 leading-tight">{job.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-1">
                <span className="font-medium text-gray-800">Department:</span> {job.department || 'N/A'}
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-1">
                <span className="font-medium text-gray-800">Closing Date:</span> {new Date(job.closingDate).toLocaleDateString()}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-purple-600">
                  {job.totalApplicants} <span className="text-base font-normal text-gray-600">Applicants</span>
                </p>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Job ID: <span className="font-mono text-gray-700 break-all">{job.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobAnalyticsPage;
