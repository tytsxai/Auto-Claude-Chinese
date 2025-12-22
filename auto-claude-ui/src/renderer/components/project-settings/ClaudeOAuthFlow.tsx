import { useState, useEffect, useRef } from 'react';
import {
  Key,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ClaudeOAuthFlowProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

/**
 * Claude OAuth flow component for setup wizard
 * Guides users through authenticating with Claude using claude setup-token
 */
export function ClaudeOAuthFlow({ onSuccess, onCancel }: ClaudeOAuthFlowProps) {
  const [status, setStatus] = useState<'ready' | 'authenticating' | 'success' | 'error'>('ready');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | undefined>();

  // Track if we've already started auth to prevent double-execution
  const hasStartedRef = useRef(false);
  // Track the auto-advance timeout so we can cancel it on unmount/re-render
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for OAuth token detection
  useEffect(() => {
    // Clear any pending timeout from previous effect run
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }

    const unsubscribe = window.electronAPI.onTerminalOAuthToken((info) => {
      console.warn('[ClaudeOAuth] Token event received:', {
        success: info.success,
        hasEmail: !!info.email,
        profileId: info.profileId
      });

      if (info.success) {
        setEmail(info.email);
        setStatus('success');
        // Auto-advance after a short delay to show success message
        // Store the timeout ID so cleanup can cancel it if needed
        successTimeoutRef.current = setTimeout(() => {
          successTimeoutRef.current = null; // Clear ref since timeout fired
          onSuccess();
        }, 1500);
      } else {
        setError(info.message || '保存 OAuth 令牌失败');
        setStatus('error');
      }
    });

    return () => {
      unsubscribe?.();
      // Clear timeout on cleanup to prevent calling onSuccess after unmount
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, [onSuccess]);

  const handleStartAuth = async () => {
    if (hasStartedRef.current) {
      console.warn('[ClaudeOAuth] Auth already started, ignoring duplicate call');
      return;
    }
    hasStartedRef.current = true;

    console.warn('[ClaudeOAuth] Starting Claude authentication');
    setStatus('authenticating');
    setError(null);

    try {
      // Get the active profile ID
      const profilesResult = await window.electronAPI.getClaudeProfiles();

      if (!profilesResult.success || !profilesResult.data) {
        throw new Error('获取 Claude 配置文件失败');
      }

      const activeProfileId = profilesResult.data.activeProfileId;
      console.warn('[ClaudeOAuth] Initializing profile:', activeProfileId);

      // Initialize the profile - this opens a terminal and runs 'claude setup-token'
      const result = await window.electronAPI.initializeClaudeProfile(activeProfileId);

      if (!result.success) {
        throw new Error(result.error || '启动认证失败');
      }

      console.warn('[ClaudeOAuth] Authentication started, waiting for token...');
      // Status will be updated by the event listener when token is detected
    } catch (err) {
      console.error('[ClaudeOAuth] Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStatus('error');
      hasStartedRef.current = false;
    }
  };

  const handleRetry = () => {
    hasStartedRef.current = false;
    setStatus('ready');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Ready to authenticate */}
      {status === 'ready' && (
        <div className="space-y-4">
          <Card className="border border-info/30 bg-info/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Key className="h-6 w-6 text-info shrink-0 mt-0.5" />
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Claude 账号认证
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Auto-Claude 的 AI 功能需要 Claude 认证，例如路线图生成、任务自动化与创意生成。
                  </p>
                  <p className="text-sm text-muted-foreground">
                    将打开浏览器完成 Claude 账号认证。凭据将安全保存，有效期 1 年。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleStartAuth} size="lg" className="gap-2">
              <Key className="h-5 w-5" />
              Claude 账号认证
            </Button>
          </div>
        </div>
      )}

      {/* Authenticating */}
      {status === 'authenticating' && (
        <Card className="border border-info/30 bg-info/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-info shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground">
                    正在认证...
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    已打开终端窗口，请在浏览器完成认证。
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-background/50 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">正在进行：</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>终端已打开并运行 <code className="px-1 bg-muted rounded">claude setup-token</code></li>
                      <li>浏览器会打开并引导你登录 Claude</li>
                      <li>在浏览器完成 OAuth 流程</li>
                      <li>终端会显示你的令牌（以 sk-ant-oat01-... 开头）</li>
                      <li>Auto-Claude 会自动检测并保存</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success */}
      {status === 'success' && (
        <Card className="border border-success/30 bg-success/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-success">
                  认证成功！
                </h3>
                <p className="text-sm text-success/80 mt-1">
                  {email ? `已连接账号 ${email}` : 'Claude 凭据已保存'}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-success/70">
                  <Sparkles className="h-3 w-3" />
                  <span>现在可以使用 Auto-Claude 的全部 AI 功能</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {status === 'error' && error && (
        <div className="space-y-4">
          <Card className="border border-destructive/30 bg-destructive/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-destructive">
                    认证失败
                  </h3>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3">
            <Button onClick={handleRetry} variant="outline">
              重试
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="ghost">
                取消
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Cancel button for ready/authenticating states */}
      {(status === 'ready' || status === 'authenticating') && onCancel && (
        <div className="flex justify-center pt-2">
          <Button onClick={onCancel} variant="ghost" size="sm">
            暂时跳过
          </Button>
        </div>
      )}
    </div>
  );
}
