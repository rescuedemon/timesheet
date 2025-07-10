// Project information display component
// Shows selected project and subproject with color coding

import React, { useRef, useEffect } from 'react';
import { Project, Subproject } from '@/types';
import { generateProjectColor, isColorCodedProjectsEnabled } from '@/lib/projectColors';

interface ProjectInfoProps {
  selectedProject?: Project;
  selectedSubproject?: Subproject;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  selectedProject,
  selectedSubproject
}) => {
  const projectInfoRef = useRef<HTMLDivElement>(null);
  const colorCodedEnabled = isColorCodedProjectsEnabled();
  const showProjectInfo = selectedProject && selectedSubproject;

  useEffect(() => {
    if (selectedProject && selectedSubproject && projectInfoRef.current) {
      projectInfoRef.current.style.opacity = '0';
      projectInfoRef.current.style.transform = 'translateY(-20px) scale(0.9)';
      setTimeout(() => {
        if (projectInfoRef.current) {
          projectInfoRef.current.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          projectInfoRef.current.style.opacity = '1';
          projectInfoRef.current.style.transform = 'translateY(0) scale(1)';
        }
      }, 10);
    }
  }, [selectedProject, selectedSubproject]);

  const getProjectInfoStyle = () => {
    if (!showProjectInfo || !colorCodedEnabled) return {};
    
    const baseColor = generateProjectColor(selectedProject.name);
    return {
      backgroundColor: baseColor,
      borderColor: baseColor.replace('0.7', '0.9'),
      boxShadow: `0 10px 30px ${baseColor.replace('0.7', '0.3')}, 0 4px 10px rgba(0,0,0,0.1)`
    };
  };

  return (
    <div 
      ref={projectInfoRef}
      className={`text-center space-y-2 px-8 py-6 rounded-2xl border shadow-xl backdrop-blur-lg transition-all duration-300 mx-6 mt-6 mb-8 min-w-[320px] max-w-[480px] truncate ${
        showProjectInfo ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={getProjectInfoStyle()}
    >
      {showProjectInfo && (
        <>
          <div className="text-xl font-medium text-gray-800 tracking-tight truncate">
            {selectedProject.name}
          </div>
          <div className="text-sm text-gray-700 font-light truncate">
            {selectedSubproject.name}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectInfo;