import {
  TrendingUp,
  Code2,
  FileCode,
  Circle
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import {
  IDEATION_EFFORT_COLORS
} from '../../../../shared/constants';
import type { CodeImprovementIdea } from '../../../../shared/types';

interface CodeImprovementDetailsProps {
  idea: CodeImprovementIdea;
}

const IDEATION_EFFORT_LABELS_ZH: Record<string, string> = {
  trivial: '极小',
  small: '小',
  medium: '中',
  large: '大',
  complex: '复杂'
};

export function CodeImprovementDetails({ idea }: CodeImprovementDetailsProps) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 text-center">
          <div className={`text-lg font-semibold ${IDEATION_EFFORT_COLORS[idea.estimatedEffort]}`}>
            {IDEATION_EFFORT_LABELS_ZH[idea.estimatedEffort] ?? idea.estimatedEffort}
          </div>
          <div className="text-xs text-muted-foreground">工作量</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold">{idea.affectedFiles?.length ?? 0}</div>
          <div className="text-xs text-muted-foreground">文件数</div>
        </Card>
      </div>

      {/* Builds Upon */}
      {idea.buildsUpon && idea.buildsUpon.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            依赖基础
          </h3>
          <div className="flex flex-wrap gap-1">
            {idea.buildsUpon.map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Approach */}
      {idea.implementationApproach && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            实现思路
          </h3>
          <p className="text-sm text-muted-foreground">{idea.implementationApproach}</p>
        </div>
      )}

      {/* Affected Files */}
      {idea.affectedFiles && idea.affectedFiles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            涉及文件
          </h3>
          <ul className="space-y-1">
            {idea.affectedFiles.map((file, i) => (
              <li key={i} className="text-sm font-mono text-muted-foreground">
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Existing Patterns */}
      {idea.existingPatterns && idea.existingPatterns.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">遵循的模式</h3>
          <ul className="space-y-1">
            {idea.existingPatterns.map((pattern, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <Circle className="h-3 w-3 mt-1.5 shrink-0" />
                {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
