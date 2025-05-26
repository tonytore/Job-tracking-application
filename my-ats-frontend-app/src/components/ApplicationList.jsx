import React, { useEffect, useState } from 'react';

// Shadcn UI Dialog Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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

// Helper function to construct the correct file URL
const getFileUrl = (API_BASE_URL, fileName) => {
  const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL.replace('/api/v1', '') : API_BASE_URL;
  return `${baseUrl}/uploads/${fileName}`;
};

// Helper function for truncating text by word count
const truncateWords = (text, maxWords) => {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
};

const ApplicationList = ({ API_BASE_URL, token }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for managing the cover letter dialog
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = useState(false);
  const [currentCoverLetterText, setCurrentCoverLetterText] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setApplications(data);
        console.log("Applications fetched successfully:", data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError('Failed to load applications. Please ensure you are logged in and the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
      setError('You must be logged in to view applications.');
    }
  }, [API_BASE_URL, token]);

  // Function to open the dialog with the full cover letter text
  const openCoverLetterDialog = (text) => {
    setCurrentCoverLetterText(text);
    setIsCoverLetterDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
        <Spinner />
        <p className="ml-4 text-lg text-gray-600">Loading applications...</p>
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

  // --- CHANGED: More aggressive truncation ---
  const MAX_COVER_LETTER_WORDS = 30; // Reduced from 50 to 30 words for a cleaner card look
  // --- END CHANGED ---

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">All Job Applications</h2>

      {applications.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-md">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {applications.map((app) => {
            const displayCoverLetterPreview = truncateWords(app.coverLetter, MAX_COVER_LETTER_WORDS);
            const needsTruncation = app.coverLetter && app.coverLetter.split(/\s+/).length > MAX_COVER_LETTER_WORDS;

            return (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden
                           transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Profile Image in top-left corner */}
                {app.profilePictureFileName && (
                  <a
                    href={getFileUrl(API_BASE_URL, app.profilePictureFileName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-0 left-0 z-10 block cursor-pointer transform -translate-x-4 -translate-y-4
                             transition-transform duration-300 ease-in-out hover:scale-110" // --- CHANGED: Added cursor-pointer ---
                  >
                    <img
                      src={getFileUrl(API_BASE_URL, app.profilePictureFileName)}
                      alt="Applicant Profile"
                      className="w-28 h-28 object-cover rounded-full border-4 border-purple-400 shadow-xl"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/112x112/E0BBE4/FFFFFF?text=No+Img'; }} // Fallback image
                    />
                  </a>
                )}

                {/* Application Details */}
                <div className={app.profilePictureFileName ? "pl-24 pt-10 sm:pl-32 sm:pt-16" : ""}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-2 leading-tight">
                    {app.applicant?.firstName} {app.applicant?.lastName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-1">
                    <span className="font-medium text-gray-800">Email:</span> {app.applicant?.email}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 mb-1">
                    <span className="font-medium text-gray-800">Job:</span> {app.jobPosting?.title || 'N/A'}
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
                                     hover:bg-purple-200 transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer" // --- CHANGED: Added cursor-pointer ---
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          View CV
                        </a>
                      </div>
                    )}

                    {/* Display text-based cover letter preview with a "View Cover Letter" link */}
                    {app.coverLetter && (
                      <div>
                        <p className="font-medium text-gray-800 mb-1">Cover Letter:</p>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200">
                          {displayCoverLetterPreview}
                          {needsTruncation && (
                            <span
                              className="ml-1 text-purple-600 cursor-pointer hover:text-purple-800 font-medium transition-colors duration-200" // --- CHANGED: Added cursor-pointer ---
                              onClick={() => openCoverLetterDialog(app.coverLetter)}
                            >
                              ... Click to view full
                            </span>
                          )}
                        </div>
                        {/* Always show "View Full Cover Letter" if it exists and wasn't truncated in the preview */}
                        {!needsTruncation && app.coverLetter && (
                          <button
                            onClick={() => openCoverLetterDialog(app.coverLetter)}
                            className="mt-2 text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors duration-200 cursor-pointer" // --- CHANGED: Added cursor-pointer ---
                          >
                            View Cover Letter
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-right border-t border-gray-100 pt-4">
                  Applied on: {new Date(app.applicationDate).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shadcn UI Dialog for Cover Letter */}
      <Dialog
        open={isCoverLetterDialogOpen}
        onOpenChange={(newValue) => {
          setIsCoverLetterDialogOpen(newValue);
          if (!newValue) {
            setCurrentCoverLetterText('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Full Cover Letter</DialogTitle>
            <DialogDescription>
              This is the complete cover letter submitted by the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto whitespace-pre-wrap p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-800">
            {currentCoverLetterText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationList;