import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useRateLimitStore } from '../stores/rate-limit-store';

/**
 * Sidebar indicator that shows when there's an active rate limit.
 * Clicking on it reopens the rate limit modal.
 */
export function RateLimitIndicator() {
  const {
    hasPendingRateLimit,
    pendingRateLimitType,
    rateLimitInfo,
    sdkRateLimitInfo,
    reopenRateLimitModal,
    clearPendingRateLimit
  } = useRateLimitStore();

  if (!hasPendingRateLimit) {
    return null;
  }

  // Get the reset time to display
  const resetTime = pendingRateLimitType === 'terminal'
    ? rateLimitInfo?.resetTime
    : sdkRateLimitInfo?.resetTime;

  // Get source info for SDK rate limits
  const source = pendingRateLimitType === 'sdk' ? sdkRateLimitInfo?.source : null;
  const sourceLabel = source ? getSourceLabel(source) : 'Claude';

  return (
    <div className="mx-3 mb-3">
      <div
        className="relative flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3 cursor-pointer hover:bg-warning/20 transition-colors"
        onClick={reopenRateLimitModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            reopenRateLimitModal();
          }
        }}
      >
        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-warning">
            已触发速率限制
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {resetTime ? (
              <>将在 {resetTime} 后重置</>
            ) : (
              <>{sourceLabel} 使用已达上限</>
            )}
          </p>
          <p className="text-xs text-primary mt-1">
            点击管理 →
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 shrink-0 hover:bg-warning/20"
          onClick={(e) => {
            e.stopPropagation();
            clearPendingRateLimit();
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">关闭</span>
        </Button>
      </div>
    </div>
  );
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'changelog': return '变更日志';
    case 'task': return '任务';
    case 'roadmap': return '路线图';
    case 'ideation': return '创意';
    case 'title-generator': return '标题生成';
    default: return 'Claude';
  }
}
