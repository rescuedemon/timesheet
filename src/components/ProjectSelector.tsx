import React, { useState, useEffect } from 'react';

// ========== Interfaces ==========
interface Project {
  id: string;
  name: string;
  subprojects: Subproject[];
  totalTime: number;
}

interface Subproject {
  id: string;
  name: string;
  totalTime: number;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  selectedSubprojectId: string;
  onProjectSelect: (projectId: string) => void;
  onSubprojectSelect: (subprojectId: string) => void;
  onAddProject: (projectName: string, subprojectName?: string) => void;
  onAddSubproject: (projectId: string, subprojectName: string) => void;
}

// ========== Helper Components ==========
const ProjectSearch: React.FC<{
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
}> = ({ projects, selectedProjectId, onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full py-2.5 pl-10 pr-4 bg-white rounded-xl border border-gray-200 focus:border-gray-800 focus:ring-1 focus:ring-gray-300 outline-none transition-all duration-200 text-sm"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-gray-500 absolute left-3" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`px-4 py-2.5 cursor-pointer flex items-center text-sm ${
                  selectedProjectId === project.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  onProjectSelect(project.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <span className="truncate">{project.name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm text-center">
              No projects found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FrequentProjects: React.FC<{
  frequentProjects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
}> = ({ frequentProjects, selectedProjectId, onProjectSelect }) => {
  if (frequentProjects.length === 0) {
    return (
      <div className="text-center py-3 text-gray-400 text-xs">
        No frequent projects yet
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {frequentProjects.map((project) => (
        <button
          key={project.id}
          className={`px-3 py-1.5 rounded-xl flex items-center text-xs transition-colors ${
            selectedProjectId === project.id
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => onProjectSelect(project.id)}
        >
          <span className="truncate max-w-[100px]">{project.name}</span>
        </button>
      ))}
    </div>
  );
};

const SubprojectSearch: React.FC<{
  selectedProject: Project;
  selectedSubprojectId: string;
  onSubprojectSelect: (subprojectId: string) => void;
}> = ({ selectedProject, selectedSubprojectId, onSubprojectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredSubprojects = selectedProject.subprojects.filter(subproject =>
    subproject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder={`Search in ${selectedProject.name}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full py-2.5 pl-10 pr-4 bg-white rounded-xl border border-gray-200 focus:border-gray-800 focus:ring-1 focus:ring-gray-300 outline-none transition-all duration-200 text-sm"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-gray-500 absolute left-3" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {filteredSubprojects.length > 0 ? (
            filteredSubprojects.map((subproject) => (
              <div
                key={subproject.id}
                className={`px-4 py-2.5 cursor-pointer flex items-center text-sm ${
                  selectedSubprojectId === subproject.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  onSubprojectSelect(subproject.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <span className="truncate">{subproject.name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm text-center">
              No subprojects found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FrequentSubprojects: React.FC<{
  frequentSubprojects: Subproject[];
  selectedSubprojectId: string;
  onSubprojectSelect: (subprojectId: string) => void;
}> = ({ frequentSubprojects, selectedSubprojectId, onSubprojectSelect }) => {
  if (frequentSubprojects.length === 0) {
    return (
      <div className="text-center py-3 text-gray-400 text-xs">
        No frequent subprojects yet
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {frequentSubprojects.map((subproject) => (
        <button
          key={subproject.id}
          className={`px-3 py-1.5 rounded-xl flex items-center text-xs transition-colors ${
            selectedSubprojectId === subproject.id
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => onSubprojectSelect(subproject.id)}
        >
          <span className="truncate max-w-[100px]">{subproject.name}</span>
        </button>
      ))}
    </div>
  );
};

// ========== Main Component ==========
const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  selectedSubprojectId,
  onProjectSelect,
  onSubprojectSelect,
  onAddProject,
  onAddSubproject
}) => {
  const [frequentSubprojectsEnabled, setFrequentSubprojectsEnabled] = useState(true);
  const [frequentProjects, setFrequentProjects] = useState<Project[]>([]);
  const [frequentSubprojects, setFrequentSubprojects] = useState<Subproject[]>([]);

  // Track frequent projects based on selection count
  useEffect(() => {
    const sorted = [...projects]
      .sort((a, b) => (b.totalTime || 0) - (a.totalTime || 0))
      .slice(0, 5);
    setFrequentProjects(sorted);
  }, [projects]);

  // Track frequent subprojects for selected project
  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const sorted = [...project.subprojects]
          .sort((a, b) => (b.totalTime || 0) - (a.totalTime || 0))
          .slice(0, 5);
        setFrequentSubprojects(sorted);
      }
    }
  }, [selectedProjectId, projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedSubproject = selectedProject?.subprojects.find(s => s.id === selectedSubprojectId);

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      onProjectSelect(projectId);
      // Auto-select first subproject if none selected
      if (project.subprojects.length > 0 && !selectedSubprojectId) {
        onSubprojectSelect(project.subprojects[0].id);
      }
    }
  };

  const handleSubprojectSelect = (subprojectId: string) => {
    if (selectedProject) {
      onSubprojectSelect(subprojectId);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Project Search */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
        <ProjectSearch
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
        />
      </div>
      
      {/* Frequent Projects */}
      {frequentProjects.length > 0 && (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 mb-2 px-1 uppercase tracking-wider">
            Frequent Projects
          </h3>
          <FrequentProjects
            frequentProjects={frequentProjects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
          />
        </div>
      )}

      {selectedProject && (
        <div className="space-y-4 mt-auto">
          {/* Subproject Search */}
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <SubprojectSearch
              selectedProject={selectedProject}
              selectedSubprojectId={selectedSubprojectId}
              onSubprojectSelect={handleSubprojectSelect}
            />
          </div>

          {/* Frequent Subprojects */}
          {frequentSubprojectsEnabled && frequentSubprojects.length > 0 && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <h3 className="text-xs font-medium text-gray-500 mb-2 px-1 uppercase tracking-wider">
                Frequent in {selectedProject.name}
              </h3>
              <FrequentSubprojects
                frequentSubprojects={frequentSubprojects}
                selectedSubprojectId={selectedSubprojectId}
                onSubprojectSelect={handleSubprojectSelect}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;