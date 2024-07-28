import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProjectList from "./components/ProjectList";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortStars, setSortStars] = useState('desc');
  const [sortUpdated, setSortUpdated] = useState('recent');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <h1 className="text-3xl font-bold text-center">Github Glimpse</h1>
        </header>
        <div className="flex flex-col md:flex-row">
          <button
            className="md:hidden mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? 'Close Filters' : 'Filter Repos'}
          </button>
          <div className={`md:w-64 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            <Sidebar 
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              sortStars={sortStars}
              sortUpdated={sortUpdated}
              onSortStarsChange={setSortStars}
              onSortUpdatedChange={setSortUpdated}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
            />
          </div>
          <main className="flex-1 md:ml-8">
            <ProjectList 
              selectedLanguage={selectedLanguage} 
              sortStars={sortStars}
              sortUpdated={sortUpdated}
              selectedTags={selectedTags}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;