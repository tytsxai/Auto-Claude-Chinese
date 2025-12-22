/**
 * Team and project selection dropdowns
 */

import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import type { LinearTeam, LinearProject } from '../types';

interface TeamProjectSelectorProps {
  teams: LinearTeam[];
  projects: LinearProject[];
  selectedTeamId: string;
  selectedProjectId: string;
  isLoadingTeams: boolean;
  isLoadingProjects: boolean;
  onTeamChange: (teamId: string) => void;
  onProjectChange: (projectId: string) => void;
}

export function TeamProjectSelector({
  teams,
  projects,
  selectedTeamId,
  selectedProjectId,
  isLoadingTeams,
  isLoadingProjects,
  onTeamChange,
  onProjectChange
}: TeamProjectSelectorProps) {
  return (
    <div className="flex gap-4 shrink-0">
      <div className="flex-1 space-y-2">
        <Label className="text-sm font-medium text-foreground">团队</Label>
        <Select
          value={selectedTeamId}
          onValueChange={onTeamChange}
          disabled={isLoadingTeams}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingTeams ? '加载中...' : '选择团队'} />
          </SelectTrigger>
          <SelectContent>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id}>
                {team.name} ({team.key})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label className="text-sm font-medium text-foreground">项目（可选）</Label>
        <Select
          value={selectedProjectId}
          onValueChange={onProjectChange}
          disabled={isLoadingProjects || !selectedTeamId}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingProjects ? '加载中...' : '所有项目'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">所有项目</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
