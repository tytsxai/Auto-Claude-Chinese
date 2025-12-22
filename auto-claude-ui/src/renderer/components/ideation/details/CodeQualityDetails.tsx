import {
  Code2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  FileCode,
  BookOpen,
  Clock
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import {
  CODE_QUALITY_SEVERITY_COLORS,
  CODE_QUALITY_CATEGORY_LABELS,
  IDEATION_EFFORT_COLORS
} from '../../../../shared/constants';
import type { CodeQualityIdea } from '../../../../shared/types';

interface CodeQualityDetailsProps {
  idea: CodeQualityIdea;
}

const CODE_QUALITY_SEVERITY_LABELS_ZH: Record<string, string> = {
  suggestion: '建议',
  minor: '轻微',
  major: '严重',
  critical: '关键'
};

const IDEATION_EFFORT_LABELS_ZH: Record<string, string> = {
  trivial: '极小',
  small: '小',
  medium: '中',
  large: '大',
  complex: '复杂'
};

export function CodeQualityDetails({ idea }: CodeQualityDetailsProps) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 text-center">
          <div className={`text-lg font-semibold ${CODE_QUALITY_SEVERITY_COLORS[idea.severity]}`}>
            {CODE_QUALITY_SEVERITY_LABELS_ZH[idea.severity] ?? idea.severity}
          </div>
          <div className="text-xs text-muted-foreground">严重程度</div>
        </Card>
        <Card className="p-3 text-center">
          <div className={`text-lg font-semibold ${IDEATION_EFFORT_COLORS[idea.estimatedEffort]}`}>
            {IDEATION_EFFORT_LABELS_ZH[idea.estimatedEffort] ?? idea.estimatedEffort}
          </div>
          <div className="text-xs text-muted-foreground">工作量</div>
        </Card>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          分类
        </h3>
        <Badge variant="outline">
          {CODE_QUALITY_CATEGORY_LABELS[idea.category]}
        </Badge>
      </div>

      {/* Breaking Change Warning */}
      {idea.breakingChange && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">破坏性变更</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            此重构可能破坏现有代码或测试。
          </p>
        </div>
      )}

      {/* Current State */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          当前状态
        </h3>
        <p className="text-sm text-muted-foreground">{idea.currentState}</p>
      </div>

      {/* Proposed Change */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          建议改动
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{idea.proposedChange}</p>
      </div>

      {/* Code Example */}
      {idea.codeExample && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            代码示例
          </h3>
          <pre className="text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-x-auto">
            {idea.codeExample}
          </pre>
        </div>
      )}

      {/* Metrics (if available) */}
      {idea.metrics && (
        <div>
          <h3 className="text-sm font-medium mb-2">指标</h3>
          <div className="grid grid-cols-2 gap-2">
            {idea.metrics.lineCount && (
              <Card className="p-2 text-center">
                <div className="text-sm font-semibold">{idea.metrics.lineCount}</div>
                <div className="text-xs text-muted-foreground">行数</div>
              </Card>
            )}
            {idea.metrics.complexity && (
              <Card className="p-2 text-center">
                <div className="text-sm font-semibold">{idea.metrics.complexity}</div>
                <div className="text-xs text-muted-foreground">复杂度</div>
              </Card>
            )}
            {idea.metrics.duplicateLines && (
              <Card className="p-2 text-center">
                <div className="text-sm font-semibold">{idea.metrics.duplicateLines}</div>
                <div className="text-xs text-muted-foreground">重复行</div>
              </Card>
            )}
            {idea.metrics.testCoverage !== undefined && (
              <Card className="p-2 text-center">
                <div className="text-sm font-semibold">{idea.metrics.testCoverage}%</div>
                <div className="text-xs text-muted-foreground">测试覆盖率</div>
              </Card>
            )}
          </div>
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

      {/* Best Practice */}
      {idea.bestPractice && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            最佳实践
          </h3>
          <p className="text-sm text-muted-foreground">{idea.bestPractice}</p>
        </div>
      )}

      {/* Prerequisites */}
      {idea.prerequisites && idea.prerequisites.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            前置条件
          </h3>
          <ul className="space-y-1">
            {idea.prerequisites.map((prereq, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
