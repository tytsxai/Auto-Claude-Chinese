import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';

interface QAFeedbackSectionProps {
  feedback: string;
  isSubmitting: boolean;
  onFeedbackChange: (value: string) => void;
  onReject: () => void;
}

/**
 * Displays the QA feedback section where users can request changes
 */
export function QAFeedbackSection({
  feedback,
  isSubmitting,
  onFeedbackChange,
  onReject
}: QAFeedbackSectionProps) {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
      <h3 className="font-medium text-sm text-foreground mb-2 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-warning" />
        请求修改
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        发现问题？请描述需要修复的内容，AI 会继续处理。
      </p>
      <Textarea
        placeholder="请描述问题或需要的修改..."
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        className="mb-3"
        rows={3}
      />
      <Button
        variant="warning"
        onClick={onReject}
        disabled={isSubmitting || !feedback.trim()}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            提交中...
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            请求修改
          </>
        )}
      </Button>
    </div>
  );
}
