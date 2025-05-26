// src/components/JobListingPage.jsx
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const JobListingPage = ({ API_BASE_URL, navigateTo, searchQuery }) => { // NEW: Receive searchQuery
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalJobPostings, setOriginalJobPostings] = useState([]); // NEW: Store original list

  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOriginalJobPostings(data || []); // Store original data
        setJobPostings(data || []); // Initialize displayed data
      } catch (err) {
        console.error("Failed to fetch job postings:", err);
        setError("Failed to load job postings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [API_BASE_URL]);

  // NEW: Effect to filter job postings when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = originalJobPostings.filter(job => {
        // Search in job title
        if (job.title?.toLowerCase().includes(lowercasedQuery)) return true;

        // Search in description
        if (job.description?.toLowerCase().includes(lowercasedQuery)) return true;

        // Search in department
        if (job.department?.toLowerCase().includes(lowercasedQuery)) return true;

        // Search in required skills
        if (job.requiredSkills?.some(skill => skill.toLowerCase().includes(lowercasedQuery))) return true;

        // Add other fields to search as needed
        return false;
      });
      setJobPostings(filtered);
    } else {
      setJobPostings(originalJobPostings); // If query is empty, show all original job postings
    }
  }, [searchQuery, originalJobPostings]);


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
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center animate-fade-in-down">
        Explore Job Opportunities
      </h1>

      {jobPostings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-md">
          {searchQuery ? `No job postings found matching "${searchQuery}".` : "No job postings found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 relative"
              onClick={() => navigateTo('apply', job.id)}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-2 truncate">
                  {job.title}
                </h2>
                {job.department && (
                  <p className="text-gray-600 text-lg mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 12a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 19a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"></path></svg>
                    {job.department}
                  </p>
                )}
                {job.closingDate && (
                  <p className="text-gray-500 text-base mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M17 11h.01M7 15h.01M17 15h.01M7 19h.01M17 19h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Closes: {new Date(job.closingDate).toLocaleDateString()}
                  </p>
                )}
                <p className="text-gray-700 line-clamp-3 mb-4 text-sm">
                  {job.description || 'No description provided.'}
                </p>
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        +{job.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('apply', job.id);
                  }}
                  className="w-full text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-center cursor-pointer"
                >
                  Apply Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListingPage;