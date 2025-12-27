import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { app } from 'electron';
import { getProfileEnv } from '../rate-limit-detector';
import { findPythonCommand } from '../python-detector';

/**
 * Configuration manager for insights service
 * Handles path detection and environment variable loading
 */
export class InsightsConfig {
  // Auto-detect Python command on initialization
  private pythonPath: string = findPythonCommand() || 'python';
  private autoBuildSourcePath: string = '';

  /**
   * Configure paths for Python and auto-claude source
   */
  configure(pythonPath?: string, autoBuildSourcePath?: string): void {
    if (pythonPath) {
      this.pythonPath = pythonPath;
    }
    if (autoBuildSourcePath) {
      this.autoBuildSourcePath = autoBuildSourcePath;
    }
  }

  /**
   * Get configured Python path
   * Prefers venv Python in auto-claude-source if available
   */
  getPythonPath(): string {
    // Try venv Python first
    const autoBuildSource = this.getAutoBuildSourcePath();
    if (autoBuildSource) {
      const isWindows = process.platform === 'win32';
      const candidates = isWindows
        ? [path.join(autoBuildSource, '.venv', 'Scripts', 'python.exe')]
        : [
          path.join(autoBuildSource, '.venv', 'bin', 'python'),
          path.join(autoBuildSource, '.venv', 'bin', 'python3')
        ];

      for (const candidate of candidates) {
        if (existsSync(candidate)) {
          return candidate;
        }
      }
    }
    return this.pythonPath;
  }

  /**
   * Get the auto-claude source path (detects automatically if not configured)
   */
  getAutoBuildSourcePath(): string | null {
    if (this.autoBuildSourcePath && existsSync(this.autoBuildSourcePath)) {
      return this.autoBuildSourcePath;
    }

    const possiblePaths = [
      // Preferred: userData copy (writable; can contain a venv)
      path.join(app.getPath('userData'), 'auto-claude-source'),
      path.resolve(__dirname, '..', '..', '..', 'auto-claude'),
      path.resolve(app.getAppPath(), '..', 'auto-claude'),
      // For packaged app: app.asar is a file, use dirname to get Resources dir
      path.join(path.dirname(app.getAppPath()), 'auto-claude'),
      path.resolve(process.cwd(), 'auto-claude')
    ];

    for (const p of possiblePaths) {
      // Use requirements.txt as marker - it always exists in auto-claude source
      if (existsSync(p) && existsSync(path.join(p, 'requirements.txt'))) {
        return p;
      }
    }
    return null;
  }

  /**
   * Load environment variables from auto-claude .env file
   */
  loadAutoBuildEnv(): Record<string, string> {
    const autoBuildSource = this.getAutoBuildSourcePath();
    if (!autoBuildSource) return {};

    const envPath = path.join(autoBuildSource, '.env');
    if (!existsSync(envPath)) return {};

    try {
      const envContent = readFileSync(envPath, 'utf-8');
      const envVars: Record<string, string> = {};

      // Handle both Unix (\n) and Windows (\r\n) line endings
      for (const line of envContent.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();

          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          envVars[key] = value;
        }
      }

      return envVars;
    } catch {
      return {};
    }
  }

  /**
   * Get complete environment for process execution
   * Includes system env, auto-claude env, and active Claude profile
   */
  getProcessEnv(): Record<string, string> {
    const autoBuildEnv = this.loadAutoBuildEnv();
    const profileEnv = getProfileEnv();

    return {
      ...process.env as Record<string, string>,
      ...autoBuildEnv,
      ...profileEnv,
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1'
    };
  }
}
