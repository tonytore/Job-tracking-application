// src/components/Home.jsx


const HomePage = ({ navigateTo, handleHomePageSearchSubmit, homePageSearchInput, setHomePageSearchInput }) => { // Updated props

  // The local state for the input is now directly tied to homePageSearchInput prop
  // No need for separate useState here, it's controlled from App.jsx

  const handleHomeSearchChange = (e) => {
    setHomePageSearchInput(e.target.value); // Update the homePageSearchInput in App.jsx
  };

  const handleHomeSearchSubmit = (e) => {
    e.preventDefault();
    handleHomePageSearchSubmit(homePageSearchInput); // Pass the local input value to App.jsx
  };

  const handleClearHomeSearch = () => {
    setHomePageSearchInput(''); // Clear the home page input
    // Optionally, if you clear the home search, you might want to clear global search too,
    // but typically the home search is only for initiating a new search.
    // So, we'll let App.jsx handle clearing global search on navigation away.
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-10 w-full max-w-3xl">
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-4 animate-fade-in-down">
          Your Next Career Awaits!
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-in-up">
          Discover thousands of job opportunities from leading companies.
        </p>

        {/* Prominent Search Bar */}
        <form onSubmit={handleHomeSearchSubmit} className="flex flex-col sm:flex-row items-center justify-center w-full max-w-2xl mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:flex-grow">
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              value={homePageSearchInput} // Controlled by homePageSearchInput prop
              onChange={handleHomeSearchChange} // Updates homePageSearchInput in App.jsx
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg text-gray-700 shadow-sm transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            {homePageSearchInput && (
              <button
                type="button"
                onClick={handleClearHomeSearch} // Clear home page input
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg"
          >
            Search
          </button>
        </form>
      </section>

      {/* Call to Action for Browse */}
      <div className="mt-12">
        <p className="text-xl text-gray-700 mb-6">
          Not sure where to start?
        </p>
        <button
          onClick={() => navigateTo('jobListings')}
          className="px-10 py-4 cursor-pointer bg-purple-600 text-white font-bold rounded-full shadow-xl hover:bg-purple-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-xl"
        >
          Browse All Jobs
        </button>
      </div>

      {/* NEW SECTION: Why Choose Us */}
      <section className="mt-20 w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Why Choose Our Job Portal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Opportunities</h3>
            <p className="text-gray-600 text-center">Access a curated list of legitimate job postings from trusted companies.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Easy Application</h3>
            <p className="text-gray-600 text-center">Our streamlined process makes applying for jobs quick and hassle-free.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            <svg className="w-16 h-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Career Growth</h3>
            <p className="text-gray-600 text-center">Find opportunities that align with your long-term career goals and aspirations.</p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Companies Hiring */}
      <section className="mt-20 w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Companies Hiring Now</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* Dummy Company Logos (replace with actual image URLs or SVG later) */}
          <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-gray-600 font-bold">Company A</span>
          </div>
          <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-gray-600 font-bold">Company B</span>
          </div>
          <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-gray-600 font-bold">Company C</span>
          </div>
          <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-gray-600 font-bold">Company D</span>
          </div>
          <div className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-gray-600 font-bold">Company E</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;