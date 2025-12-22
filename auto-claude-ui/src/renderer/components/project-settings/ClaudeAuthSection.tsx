import { Key, ExternalLink, Loader2, Globe } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { StatusBadge } from './StatusBadge';
import { PasswordInput } from './PasswordInput';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import type { ProjectEnvConfig } from '../../../shared/types';

interface ClaudeAuthSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  envConfig: ProjectEnvConfig | null;
  isLoadingEnv: boolean;
  envError: string | null;
  isCheckingAuth: boolean;
  authStatus: 'checking' | 'authenticated' | 'not_authenticated' | 'error';
  onClaudeSetup: () => void;
  onUpdateConfig: (updates: Partial<ProjectEnvConfig>) => void;
}

export function ClaudeAuthSection({
  isExpanded,
  onToggle,
  envConfig,
  isLoadingEnv,
  envError,
  isCheckingAuth,
  authStatus,
  onClaudeSetup,
  onUpdateConfig,
}: ClaudeAuthSectionProps) {
  const badge = authStatus === 'authenticated' ? (
    <StatusBadge status="success" label="已连接" />
  ) : authStatus === 'not_authenticated' ? (
    <StatusBadge status="warning" label="未连接" />
  ) : null;

  return (
    <CollapsibleSection
      title="Claude 认证"
      icon={<Key className="h-4 w-4" />}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={badge}
    >
      {isLoadingEnv ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          正在加载配置...
        </div>
      ) : envConfig ? (
        <>
          {/* Claude CLI Status */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Claude CLI</p>
                <p className="text-xs text-muted-foreground">
                  {isCheckingAuth ? '检查中...' :
                    authStatus === 'authenticated' ? '已通过 OAuth 认证' :
                    authStatus === 'not_authenticated' ? '未认证' :
                    '状态未知'}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onClaudeSetup}
                disabled={isCheckingAuth}
              >
                {isCheckingAuth ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {authStatus === 'authenticated' ? '重新认证' : '配置 OAuth'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Manual OAuth Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                OAuth Token{envConfig.claudeTokenIsGlobal ? '（覆盖）' : ''}
              </Label>
              {envConfig.claudeTokenIsGlobal && (
                <span className="flex items-center gap-1 text-xs text-info">
                  <Globe className="h-3 w-3" />
                  使用全局令牌
                </span>
              )}
            </div>
            {envConfig.claudeTokenIsGlobal ? (
              <p className="text-xs text-muted-foreground">
                当前使用应用设置中的令牌。如需覆盖，请在下方输入项目级令牌。
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                粘贴来自 <code className="px-1 bg-muted rounded">claude setup-token</code> 的令牌
              </p>
            )}
            <PasswordInput
              value={envConfig.claudeTokenIsGlobal ? '' : (envConfig.claudeOAuthToken || '')}
              onChange={(value) => onUpdateConfig({
                claudeOAuthToken: value || undefined,
              })}
              placeholder={envConfig.claudeTokenIsGlobal ? '在此输入以覆盖全局令牌...' : '在此输入 OAuth Token'}
            />
          </div>
        </>
      ) : envError ? (
        <p className="text-sm text-destructive">{envError}</p>
      ) : null}
    </CollapsibleSection>
  );
}
