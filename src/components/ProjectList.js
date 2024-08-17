import React, { useState, useEffect, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { FaSearch, FaGithub, FaTag } from 'react-icons/fa';
import axios from 'axios';

function ProjectList({ selectedLanguage, sortStars, sortUpdated, selectedTags }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSortCriterion, setLastSortCriterion] = useState('stars');
  const [repoSearch, setRepoSearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // Projects per page

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://us-central1-githubglimpse.cloudfunctions.net/appFunction/repos');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    setLastSortCriterion('stars');
  }, [sortStars]);

  useEffect(() => {
    setLastSortCriterion('activity');
  }, [sortUpdated]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteToggle = (projectName) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(projectName)
        ? prevFavorites.filter((name) => name !== projectName)
        : [...prevFavorites, projectName]
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const projectLanguages = Object.keys(project.languages || {});
      const matchesLanguage = selectedLanguage === "All" || projectLanguages.includes(selectedLanguage);
      const matchesTags = selectedTags.length === 0 || project.issues.some(issue =>
        issue.labels.some(label => selectedTags.includes(label))
      );
      const matchesRepoSearch = project.name.toLowerCase().includes(repoSearch.toLowerCase());
      const matchesIssueSearch = project.issues.some(issue => 
        issue.title.toLowerCase().includes(issueSearch.toLowerCase())
      );
      return matchesLanguage && matchesTags && matchesRepoSearch && matchesIssueSearch;
    });
  }, [projects, selectedLanguage, selectedTags, repoSearch, issueSearch]);

  const sortedProjects = useMemo(() => {
    const sortedFiltered = [...filteredProjects].sort((a, b) => {
      if (lastSortCriterion === 'stars') {
        return sortStars === 'desc' ? b.stars - a.stars : a.stars - b.stars;
      } else {
        const dateA = new Date(a.lastActivity);
        const dateB = new Date(b.lastActivity);
        return sortUpdated === 'recent' ? dateB - dateA : dateA - dateB;
      }
    });

    const favoriteProjects = sortedFiltered.filter(project => favorites.includes(project.name));
    const nonFavoriteProjects = sortedFiltered.filter(project => !favorites.includes(project.name));

    return [...favoriteProjects, ...nonFavoriteProjects];
  }, [filteredProjects, lastSortCriterion, sortStars, sortUpdated, favorites]);

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const handleSelect = (projectName) => {
    setSelectedProject((prevSelected) =>
      prevSelected === projectName ? null : projectName
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-white">Repository List</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={repoSearch}
              onChange={(e) => setRepoSearch(e.target.value)}
              className="w-full p-2 pl-10 pr-4 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative flex-grow">
            <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={issueSearch}
              onChange={(e) => setIssueSearch(e.target.value)}
              className="w-full p-2 pl-10 pr-4 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              isSelected={selectedProject === project.name}
              onSelect={() => handleSelect(project.name)}
              isFavorite={favorites.includes(project.name)}
              onFavoriteToggle={() => handleFavoriteToggle(project.name)}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No projects found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-md ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
