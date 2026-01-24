
import React from 'react';
import { PROJECTS } from '../constants';
import ProjectTile from './ProjectTile';

interface ProjectGridProps {
  onAboutClick: () => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ onAboutClick }) => {

  const projectsToShow = PROJECTS.filter(p => p.category === 'Selected' || p.category === 'Experiments');

  return (
    <div className="w-full bg-[#f8f8f8] px-6 py-12">
      <div className="flex justify-start items-center space-x-8 mb-12">
         <button 
           onClick={onAboutClick}
           className="text-sm uppercase tracking-widest text-black hover:text-[#2C4A3C] transition-colors duration-300"
         >
           About
         </button>
         <span className="text-neutral-400">/</span>
         <a 
           href="mailto:iamjeanine@me.com"
           className="text-sm uppercase tracking-widest text-black hover:text-[#2C4A3C] transition-colors duration-300"
         >
           Contact
         </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectsToShow.map((project, index) => (
          <ProjectTile key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;
