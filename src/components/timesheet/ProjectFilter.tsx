// Project filtering component for timesheet views
// Provides project and subproject filtering capabilities

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';

interface ProjectFilterProps {
  projects: string[];
  subprojects: string[];
  selectedProjects: Set<string>;
  selectedSubprojects: Set<string>;
  onProjectToggle: (project: string) => void;
  onSubprojectToggle: (subproject: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  projects,
  subprojects,
  selectedProjects,
  selectedSubprojects,
  onProjectToggle,
  onSubprojectToggle,
  onClearFilters,
  isOpen,
  onOpenChange
}) => {
  const activeFiltersCount = selectedProjects.size + selectedSubprojects.size;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="btn-modern shadow-lg hover:shadow-xl rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-card border-border/40 shadow-2xl backdrop-blur-xl rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Filter Options</h4>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {projects.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Projects:</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {projects.map(project => (
                  <div key={project} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project}`}
                      checked={selectedProjects.has(project)}
                      onCheckedChange={() => onProjectToggle(project)}
                    />
                    <Label htmlFor={`project-${project}`} className="text-sm truncate">
                      {project}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {subprojects.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Subprojects:</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {subprojects.map(subproject => (
                  <div key={subproject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subproject-${subproject}`}
                      checked={selectedSubprojects.has(subproject)}
                      onCheckedChange={() => onSubprojectToggle(subproject)}
                    />
                    <Label htmlFor={`subproject-${subproject}`} className="text-sm truncate">
                      {subproject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={onClearFilters} className="w-full">
            Clear All Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectFilter;