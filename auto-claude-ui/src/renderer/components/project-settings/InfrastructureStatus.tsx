import { Loader2, CheckCircle2, AlertCircle, Download, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import type { InfrastructureStatus as InfrastructureStatusType } from '../../../shared/types';

interface InfrastructureStatusProps {
  infrastructureStatus: InfrastructureStatusType | null;
  isCheckingInfrastructure: boolean;
  isStartingFalkorDB: boolean;
  isOpeningDocker: boolean;
  onStartFalkorDB: () => void;
  onOpenDockerDesktop: () => void;
  onDownloadDocker: () => void;
}

export function InfrastructureStatus({
  infrastructureStatus,
  isCheckingInfrastructure,
  isStartingFalkorDB,
  isOpeningDocker,
  onStartFalkorDB,
  onOpenDockerDesktop,
  onDownloadDocker,
}: InfrastructureStatusProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">基础设施状态</span>
        {isCheckingInfrastructure && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Docker Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {infrastructureStatus?.docker.running ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : infrastructureStatus?.docker.installed ? (
            <AlertCircle className="h-4 w-4 text-warning" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          <span className="text-xs text-foreground">Docker</span>
        </div>
        <div className="flex items-center gap-2">
          {infrastructureStatus?.docker.running ? (
            <span className="text-xs text-success">运行中</span>
          ) : infrastructureStatus?.docker.installed ? (
            <>
              <span className="text-xs text-warning">未运行</span>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenDockerDesktop}
                disabled={isOpeningDocker}
                className="h-6 text-xs"
              >
                {isOpeningDocker ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : null}
                启动 Docker
              </Button>
            </>
          ) : (
            <>
              <span className="text-xs text-destructive">未安装</span>
              <Button
                size="sm"
                variant="outline"
                onClick={onDownloadDocker}
                className="h-6 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                安装
              </Button>
            </>
          )}
        </div>
      </div>

      {/* FalkorDB Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {infrastructureStatus?.falkordb.healthy ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : infrastructureStatus?.falkordb.containerRunning ? (
            <Loader2 className="h-4 w-4 animate-spin text-warning" />
          ) : (
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-xs text-foreground">FalkorDB</span>
        </div>
        <div className="flex items-center gap-2">
          {infrastructureStatus?.falkordb.healthy ? (
            <span className="text-xs text-success">就绪</span>
          ) : infrastructureStatus?.falkordb.containerRunning ? (
            <span className="text-xs text-warning">启动中...</span>
          ) : infrastructureStatus?.docker.running ? (
            <>
              <span className="text-xs text-muted-foreground">未运行</span>
              <Button
                size="sm"
                variant="outline"
                onClick={onStartFalkorDB}
                disabled={isStartingFalkorDB}
                className="h-6 text-xs"
              >
                {isStartingFalkorDB ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                启动
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">需要 Docker</span>
          )}
        </div>
      </div>

      {/* Overall Status Message */}
      {infrastructureStatus?.ready ? (
        <div className="text-xs text-success flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          图谱记忆已就绪
        </div>
      ) : infrastructureStatus && !infrastructureStatus.docker.installed && (
        <p className="text-xs text-muted-foreground">
          图谱记忆需要 Docker Desktop。
        </p>
      )}
    </div>
  );
}
