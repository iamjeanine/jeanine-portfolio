
import React, { useState, useRef, useCallback } from 'react';
import { getVisibleProjects } from '../constants';
import ProjectTile from './ProjectTile';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'story-system', label: 'Story Systems' },
  { key: 'production-tool', label: 'Production Tools' },
  { key: 'cultural-experiment', label: 'Cultural Experiments' },
] as const;

const FADE_MS = 220;

const ProjectGrid: React.FC = () => {
  const allProjects = getVisibleProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayFilter, setDisplayFilter] = useState('all');
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleFilter = useCallback((key: string) => {
    if (key === activeFilter) return;
    setActiveFilter(key);
    setIsFading(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayFilter(key);
      setIsFading(false);
    }, FADE_MS);
  }, [activeFilter]);

  const filteredProjects = displayFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.filterCategories?.includes(displayFilter));

  return (
    <div className="w-full bg-[#F5F2EC] px-6 py-12">

      {/* Filter navigation — horizontal scroll on mobile, centered row on desktop */}
      <nav className="flex flex-row gap-2 md:flex-wrap md:justify-center md:gap-3 mb-8 md:mb-14 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilter(key)}
            className={`
              px-4 py-2 md:px-5 md:py-2 rounded-full text-[11px] md:text-xs tracking-[0.12em] uppercase
              transition-all duration-200 whitespace-nowrap shrink-0
              ${activeFilter === key
                ? 'bg-neutral-800 text-white border border-neutral-800'
                : 'bg-transparent text-neutral-500 border border-neutral-300 hover:border-neutral-500 hover:text-neutral-700'
              }
            `}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Project grid with fade transition */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-opacity ease-out"
        style={{
          opacity: isFading ? 0 : 1,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        {filteredProjects.map((project, index) => (
          <ProjectTile key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;
