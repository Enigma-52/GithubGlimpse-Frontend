import React, { useState } from 'react';
import { FaRegComments , FaHeart , FaRegHeart } from 'react-icons/fa6';

function ProjectCard({ project, isSelected, onSelect ,isFavorite, onFavoriteToggle }) {
  const [hoveredIssueId, setHoveredIssueId] = useState(null);

  const issuesCount = project.issues_count;

  const getTopLanguages = (languages) => {
    const languageEntries = Object.entries(languages);
    const sortedLanguages = languageEntries.sort((a, b) => b[1] - a[1]);
    const top3Languages = sortedLanguages.slice(0, 3);
    return top3Languages;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const languages = project.languages || {};
  const languageEntries = getTopLanguages(languages);

  const formatStars = (stars) => {
    if (stars === undefined || stars === null) {
      return 'N/A';
    }
    if (typeof stars !== 'number') {
      return stars.toString();
    }
    if (stars >= 1000) {
      return (stars / 1000).toFixed(1) + 'k';
    }
    return stars.toString();
  };

  const handleIssueClick = (event, url) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  const handleExploreMoreIssues = (event) => {
    event.stopPropagation();
    const url = project.issues[0].url.replace(/\/[^/]+$/, '');
    window.open(url, '_blank');
  };

  const truncateText = (text = '', maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 transition-all duration-300 ease-in-out cursor-pointer
        ${isSelected ? "ring-2 ring-green-500" : "hover:bg-gray-700"} w-full hover:shadow-lg`}
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
        <h3 className={`text-lg sm:text-xl font-semibold ${isSelected ? "text-green-500" : ""} mb-2 sm:mb-0`}>
          {truncateText(project.name, 40)}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full border border-green-500 text-sm font-bold ${isSelected ? "text-green-500" : "text-white"}`}
          >
            {issuesCount} {issuesCount === 1 ? "issue" : "issues"}
          </span>
          <button
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            title={isFavorite ? "Unfavorite this project" : "Favorite this project"}
          >
            {isFavorite ? <FaHeart className="animate-ping-once" /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      <p className="text-gray-400 mb-4 text-sm sm:text-base">{truncateText(project.description, 120)}</p>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm ${isSelected ? "text-green-500" : "text-gray-500"}`}>
        <span className="mb-2 sm:mb-0 sm:mr-4">
          stars: <span className="text-yellow-500">{formatStars(project.stars)}</span>
        </span>
        <span>
          last activity:{" "}
          <span className="text-yellow-500">{formatDate(project.lastActivity)}</span>
        </span>
      </div>

      {languageEntries.length > 0 && (
        <div className="mt-2">
          <ul className="flex flex-wrap mt-1">
            {languageEntries.map(([language]) => (
              <li
                key={language}
                className="bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-1 mr-2 mb-1"
              >
                {language}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSelected && project.issues && (
        <div className="mt-4 space-y-2">
          <h4 className="text-base sm:text-lg font-semibold">Issues:</h4>
          {project.issues.slice(0, 5).map((issue) => (
            <div
              key={issue.url}
              className={`p-2 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors duration-200 cursor-pointer
                ${hoveredIssueId === issue.url ? "text-green-500" : ""}`}
              onMouseEnter={() => setHoveredIssueId(issue.url)}
              onMouseLeave={() => setHoveredIssueId(null)}
              onClick={(event) => handleIssueClick(event, issue.url)}
            >
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <h5 className="font-medium text-xs sm:text-sm">
                  <span className="text-gray-500 mr-1">#{issue.number}</span> {truncateText(issue.title, 80)}
                </h5>
                <div className="flex flex-wrap mt-1">
                  {issue.labels.map((label) => (
                    <span key={label} className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full mr-1 mb-1">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-white p-1 sm:p-2 rounded-full flex items-center text-xs sm:text-sm">
                <FaRegComments className="mr-1 text-white" />
                {issue.commentCount}
              </span>
            </div>
          ))}
          {issuesCount > 5 && (
            <button
              onClick={handleExploreMoreIssues}
              className="mt-2 text-green-500 hover:underline text-sm"
            >
              Explore more issues
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
