
import React from 'react';
import { PROJECTS } from '../constants';
import ProjectTile from './ProjectTile';

const ProjectGrid: React.FC = () => {

  const projectsToShow = PROJECTS.filter(p => p.category === 'Selected' || p.category === 'Experiments');

  return (
    <div className="w-full bg-[#f8f8f8] px-6 py-12">
      

      <div className="grid grid-cols-2 gap-4">
        {projectsToShow.map((project, index) => (
          <ProjectTile key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;
