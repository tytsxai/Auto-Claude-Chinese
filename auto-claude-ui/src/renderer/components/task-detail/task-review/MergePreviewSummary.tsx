import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { MergeConflict, MergeStats, GitConflictInfo } from '../../../../shared/types';

interface MergePreviewSummaryProps {
  mergePreview: {
    files: string[];
    conflicts: MergeConflict[];
    summary: MergeStats;
    gitConflicts?: GitConflictInfo;
  };
  onShowConflictDialog: (show: boolean) => void;
}

/**
 * Displays a summary of the merge preview including conflicts and statistics
 */
export function MergePreviewSummary({
  mergePreview,
  onShowConflictDialog
}: MergePreviewSummaryProps) {
  const hasGitConflicts = mergePreview.gitConflicts?.hasConflicts;
  const hasAIConflicts = mergePreview.conflicts.length > 0;
  const hasHighSeverity = mergePreview.conflicts.some(
    c => c.severity === 'high' || c.severity === 'critical'
  );

  return (
    <div className={cn(
      "rounded-lg p-3 mb-3 border",
      hasGitConflicts
        ? "bg-warning/10 border-warning/30"
        : !hasAIConflicts
          ? "bg-success/10 border-success/30"
          : hasHighSeverity
            ? "bg-destructive/10 border-destructive/30"
            : "bg-warning/10 border-warning/30"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-2">
          {hasGitConflicts ? (
            <>
              <AlertTriangle className="h-4 w-4 text-warning" />
              分支已分叉 - AI 将处理
            </>
          ) : !hasAIConflicts ? (
            <>
              <CheckCircle className="h-4 w-4 text-success" />
              未检测到冲突
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-warning" />
              发现 {mergePreview.conflicts.length} 个冲突
            </>
          )}
        </span>
        {hasAIConflicts && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowConflictDialog(true)}
            className="h-7 text-xs"
          >
            查看详情
          </Button>
        )}
      </div>

      {hasGitConflicts && mergePreview.gitConflicts && (
        <div className="mb-3 p-2 bg-warning/10 rounded text-xs border border-warning/30">
          <p className="font-medium text-warning mb-1">分支已分叉 - AI 将处理</p>
          <p className="text-muted-foreground mb-2">
            自该工作树创建以来，主分支新增 {mergePreview.gitConflicts.commitsBehind} 个提交。
            {mergePreview.gitConflicts.conflictingFiles.length} 个文件需要智能合并：
          </p>
          <ul className="list-disc list-inside text-muted-foreground">
            {mergePreview.gitConflicts.conflictingFiles.map((file, idx) => (
              <li key={idx} className="truncate">{file}</li>
            ))}
          </ul>
          <p className="mt-2 text-muted-foreground">
            点击“暂存更改”后，AI 将自动合并这些冲突。
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>待合并文件：{mergePreview.summary.totalFiles}</div>
        {hasGitConflicts ? (
          <div className="text-warning">AI 将处理冲突</div>
        ) : hasAIConflicts ? (
          <>
            <div>可自动合并：{mergePreview.summary.autoMergeable}</div>
            {mergePreview.summary.aiResolved !== undefined && (
              <div>AI 已处理：{mergePreview.summary.aiResolved}</div>
            )}
            {mergePreview.summary.humanRequired !== undefined && mergePreview.summary.humanRequired > 0 && (
              <div className="text-warning">需要人工复查：{mergePreview.summary.humanRequired}</div>
            )}
          </>
        ) : (
          <div className="text-success">可直接合并</div>
        )}
      </div>
    </div>
  );
}
