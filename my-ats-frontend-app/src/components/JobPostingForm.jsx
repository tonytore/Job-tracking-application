import { useEffect, useState } from "react";

// Spinner component (assuming it's defined elsewhere or you can add it here if needed)
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


// JobPostingForm now accepts 'token' as a prop
const JobPostingForm = ({ API_BASE_URL, token }) => { // <-- Added token prop
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '', // This will be a comma-separated string from the input
    department: '',
    closingDate: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    console.log("JobPostingForm component rendered.");
    // Optional: If you want to check for token presence on mount
    if (!token) {
      setMessage('Authentication token is missing. Please log in.');
      setIsError(true);
    }
  }, [token]); // Re-run if token changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Form data updated: ${name}: ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true); // Set loading true on submission

    // Ensure token exists before attempting to submit
    if (!token) {
      setMessage('You are not authenticated. Please log in to create a job posting.');
      setIsError(true);
      setLoading(false);
      return;
    }

    // Convert requiredSkills string to an array
    const dataToSend = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
    };
    console.log("Submitting job posting with data:", dataToSend);

    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Use the JWT token here
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("Job posting submission response:", data);

      if (response.ok) {
        setMessage(data.message || 'Job posting created successfully!');
        setIsError(false);
        setFormData({ // Clear form after successful submission
          title: '',
          description: '',
          requiredSkills: '',
          department: '',
          closingDate: '',
        });
        console.log("Job posting created successfully.");
      } else {
        // Handle specific 401 Unauthorized error
        if (response.status === 401) {
          setMessage('Authentication failed. Please log in again.');
        } else {
          setMessage(data.message || 'Failed to create job posting.');
        }
        setIsError(true);
        console.error("Job posting creation failed:", data.message);
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false); // Set loading false after submission
    }
  };

  return (
    // UPDATED: Changed max-w-md to max-w-2xl for a larger proportional size
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Job Posting</h2>
      {message && (
        <div className={`p-4 mb-4 rounded-lg text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
          <input
            type="text"
            id="requiredSkills"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700">Closing Date</label>
          <input
            type="date"
            id="closingDate"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !token} // Disable if loading or no token
        >
          {loading ? <><Spinner /><span className="ml-2">Creating...</span></> : 'Create Job Posting'}
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm;
