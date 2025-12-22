import {
  Users,
  AlertCircle,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import {
  DOCUMENTATION_CATEGORY_LABELS,
  IDEATION_EFFORT_COLORS,
  IDEATION_IMPACT_COLORS
} from '../../../../shared/constants';
import type { DocumentationGapIdea } from '../../../../shared/types';

interface DocumentationGapDetailsProps {
  idea: DocumentationGapIdea;
}

const IDEATION_EFFORT_LABELS_ZH: Record<string, string> = {
  trivial: '极小',
  small: '小',
  medium: '中',
  large: '大',
  complex: '复杂'
};

const IDEATION_IMPACT_LABELS_ZH: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '关键'
};

export function DocumentationGapDetails({ idea }: DocumentationGapDetailsProps) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold">
            {DOCUMENTATION_CATEGORY_LABELS[idea.category]}
          </div>
          <div className="text-xs text-muted-foreground">分类</div>
        </Card>
        <Card className="p-3 text-center">
          <div className={`text-lg font-semibold ${IDEATION_EFFORT_COLORS[idea.estimatedEffort]}`}>
            {IDEATION_EFFORT_LABELS_ZH[idea.estimatedEffort] ?? idea.estimatedEffort}
          </div>
          <div className="text-xs text-muted-foreground">工作量</div>
        </Card>
      </div>

      {/* Target Audience */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Users className="h-4 w-4" />
          目标读者
        </h3>
        <Badge variant="outline" className="capitalize">
          {idea.targetAudience}
        </Badge>
      </div>

      {/* Current Documentation */}
      {idea.currentDocumentation && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            当前文档
          </h3>
          <p className="text-sm text-muted-foreground">{idea.currentDocumentation}</p>
        </div>
      )}

      {/* Proposed Content */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          建议补充内容
        </h3>
        <p className="text-sm text-muted-foreground">{idea.proposedContent}</p>
      </div>

      {/* Affected Areas */}
      {idea.affectedAreas && idea.affectedAreas.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            涉及范围
          </h3>
          <ul className="space-y-1">
            {idea.affectedAreas.map((area, i) => (
              <li key={i} className="text-sm font-mono text-muted-foreground">
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Priority */}
      <div>
        <h3 className="text-sm font-medium mb-2">优先级</h3>
        <Badge variant="outline" className={IDEATION_IMPACT_COLORS[idea.priority]}>
          {IDEATION_IMPACT_LABELS_ZH[idea.priority] ?? idea.priority}
        </Badge>
      </div>
    </>
  );
}
