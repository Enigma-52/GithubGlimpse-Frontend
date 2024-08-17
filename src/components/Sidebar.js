import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const languages = [
  "All",
  "Python",
  "Go",
  "Java",
  "TypeScript",
  "JavaScript",
  "Rust",
  "C++",
  "C",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Scala",
  "Haskell",
  "Dart",
  "Elixir",
  "Clojure",
  "Lua",
  "R",
  "Julia",
  "Perl",
  "Assembly",
  "COBOL"
];

function Sidebar({ selectedLanguage = "All", onSelectLanguage, sortStars, sortUpdated, onSortStarsChange, onSortUpdatedChange }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [showMore, setShowMore] = useState(false);

  const handleLanguageSelect = (lang) => {
    onSelectLanguage(lang === "All" ? "All" : lang);
  };

  const handleAddProject = async () => {
    try {
      const response = await axios.post('https://us-central1-githubglimpse.cloudfunctions.net/appFunction/add-repo', { url: repoUrl });
      setMessage('Repository added successfully!');
      setRepoUrl('');
    } catch (error) {
      setMessage('Failed to add the repository. Please try again.');
    }
  };

  const displayedLanguages = showMore ? languages : languages.slice(0, 7);

  return (
    <aside className="w-full md:w-72 p-8 bg-gray-900 text-gray-200 shadow-lg md:shadow-none mx-auto md:mx-0">
      <h2 className="text-2xl font-bold mb-6">About</h2>
      <p className="mb-8 text-sm">
      GitHub Glimpse helps contributors find most recent issues in popular open-source projects, making it easier to contribute.
      </p>
      <h3 className="text-xl font-semibold mb-4">Browse by Language</h3>
      <div className="flex flex-wrap gap-3 mb-5">
        {displayedLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageSelect(lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedLanguage === lang || (lang === "All" && selectedLanguage === "All")
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-700 hover:bg-gray-600"
            } transition duration-200`}
          >
            {lang}
          </button>
        ))}
      </div>
      {/* Show More/Less button */}
      <button
        className="text-sm font-medium text-green-600 hover:underline mb-8"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Sort Options</h3>
        <div className="mb-4">
          <label className="block mb-2">Sort by stars:</label>
          <select value={sortStars} onChange={(e) => onSortStarsChange(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Sort by last updated:</label>
          <select value={sortUpdated} onChange={(e) => onSortUpdatedChange(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <button 
        className="w-full py-3 bg-green-600 rounded-lg font-semibold text-white hover:bg-green-700 transition duration-200"
        onClick={() => setModalOpen(true)}
      >
        Add Your Project
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </aside>
  );
}

export default Sidebar;
