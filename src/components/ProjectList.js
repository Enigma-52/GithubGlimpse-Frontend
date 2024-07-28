import React, { useState, useEffect, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';

function ProjectList({ selectedLanguage, sortStars, sortUpdated, selectedTags }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSortCriterion, setLastSortCriterion] = useState('stars'); // Default to stars

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

  // Update last sort criterion when sortStars changes
  useEffect(() => {
    setLastSortCriterion('stars');
  }, [sortStars]);

  // Update last sort criterion when sortUpdated changes
  useEffect(() => {
    setLastSortCriterion('activity');
  }, [sortUpdated]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const projectLanguages = Object.keys(project.languages || {});
      const matchesLanguage = selectedLanguage === "All" || projectLanguages.includes(selectedLanguage);
      const matchesTags = selectedTags.length === 0 || project.issues.some(issue =>
        issue.labels.some(label => selectedTags.includes(label))
      );
      return matchesLanguage && matchesTags;
    });
  }, [projects, selectedLanguage, selectedTags]);

  const sortedProjects = useMemo(() => {
    console.log('Sorting by:', lastSortCriterion);
    if (lastSortCriterion === 'stars') {
      return [...filteredProjects].sort((a, b) => {
        return sortStars === 'desc' ? b.stars - a.stars : a.stars - b.stars;
      });
    } else {
      return [...filteredProjects].sort((a, b) => {
        const dateA = new Date(a.lastActivity);
        const dateB = new Date(b.lastActivity);
        return sortUpdated === 'recent' ? dateB - dateA : dateA - dateB;
      });
    }
  }, [filteredProjects, lastSortCriterion, sortStars, sortUpdated]);

  console.log('Sorted projects:', sortedProjects.map(p => `${p.name} (${p.stars} stars, ${p.lastActivity})`));

  const handleSelect = (projectName) => {
    setSelectedProject((prevSelected) =>
      prevSelected === projectName ? null : projectName
    );
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 w-full">
      <div className="space-y-6">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            isSelected={selectedProject === project.name}
            onSelect={() => handleSelect(project.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectList;