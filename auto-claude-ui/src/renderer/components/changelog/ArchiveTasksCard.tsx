import { useState } from 'react';
import { Archive, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { ChangelogTask } from '../../../shared/types';

interface ArchiveTasksCardProps {
  projectId: string;
  version: string;
  selectedTaskIds: string[];
  selectedTasks: ChangelogTask[];
}

export function ArchiveTasksCard({
  projectId,
  version,
  selectedTaskIds,
  selectedTasks
}: ArchiveTasksCardProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const handleArchive = async () => {
    setIsArchiving(true);
    setArchiveError(null);
    try {
      const result = await window.electronAPI.archiveTasks(projectId, selectedTaskIds, version);
      if (result.success) {
        setArchiveSuccess(true);
      } else {
        setArchiveError(result.error || '归档任务失败');
      }
    } catch (err) {
      setArchiveError(err instanceof Error ? err.message : '归档任务失败');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          <CardTitle className="text-base">归档已完成任务</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {archiveSuccess ? (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">
              已归档 {selectedTasks.length} 个任务！
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              归档 {selectedTasks.length} 个任务以清理看板。已归档任务可通过“显示已归档”开关查看。
            </p>
            {archiveError && (
              <div className="flex items-start gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{archiveError}</span>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleArchive}
              disabled={isArchiving}
            >
              {isArchiving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  正在归档...
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  归档 {selectedTasks.length} 个任务
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
