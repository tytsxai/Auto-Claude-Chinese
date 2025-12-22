import { Globe, RefreshCw, TrendingUp, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';

interface ExistingCompetitorAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseExisting: () => void;
  onRunNew: () => void;
  onSkip: () => void;
  analysisDate?: Date;
}

export function ExistingCompetitorAnalysisDialog({
  open,
  onOpenChange,
  onUseExisting,
  onRunNew,
  onSkip,
  analysisDate,
}: ExistingCompetitorAnalysisDialogProps) {
  const handleUseExisting = () => {
    onUseExisting();
    onOpenChange(false);
  };

  const handleRunNew = () => {
    onRunNew();
    onOpenChange(false);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '最近';
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            竞品分析选项
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            此项目已有 {formatDate(analysisDate)} 的竞品分析结果
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-3">
          {/* Option 1: Use existing (recommended) */}
          <button
            onClick={handleUseExisting}
            className="w-full rounded-lg bg-primary/10 border border-primary/30 p-4 text-left hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  使用已有分析
                  <span className="text-xs text-primary font-normal">（推荐）</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  复用现有的竞品洞察，更快且无需额外网络搜索。
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Run new analysis */}
          <button
            onClick={handleRunNew}
            className="w-full rounded-lg bg-muted/50 border border-border p-4 text-left hover:bg-muted transition-colors"
          >
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  重新分析
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  进行新的网络搜索以获取最新竞品信息，耗时更长。
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Skip */}
          <button
            onClick={handleSkip}
            className="w-full rounded-lg bg-muted/30 border border-border/50 p-4 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  跳过竞品分析
                </h4>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  不使用竞品洞察直接生成路线图。
                </p>
              </div>
            </div>
          </button>
        </div>

        <AlertDialogFooter className="sm:justify-start">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
