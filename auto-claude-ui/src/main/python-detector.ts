import { existsSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

/**
 * Detect and return the best available Python command.
 * Electron apps don't inherit shell PATH, so we check common locations.
 */
export function findPythonCommand(): string | null {
  const isWindows = process.platform === 'win32';
  const home = homedir();

  if (isWindows) {
    return 'python';
  }

  // When PATH is available, prefer command names (works in dev/test).
  // Packaged Electron apps may have an empty PATH; for that case, fall back
  // to common absolute locations.
  if (process.env.PATH) {
    return 'python3';
  }

  // Full paths for macOS/Linux (Electron doesn't inherit PATH)
  const unixPaths = [
    '/opt/homebrew/bin/python3',
    '/usr/local/bin/python3',
    '/usr/bin/python3',
    path.join(home, '.pyenv/shims/python3'),
    path.join(home, '.local/bin/python3'),
  ];

  for (const pythonPath of unixPaths) {
    if (existsSync(pythonPath)) {
      return pythonPath;
    }
  }

  return 'python3';
}

/**
 * Get the default Python command for the current platform.
 */
export function getDefaultPythonCommand(): string {
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Parse a Python command string into command and base arguments.
 */
export function parsePythonCommand(pythonPath: string): [string, string[]] {
  // If the path looks like an absolute path (starts with / or drive letter),
  // don't split it - it's a full path that may contain spaces
  if (pythonPath.startsWith('/') || /^[a-zA-Z]:/.test(pythonPath)) {
    return [pythonPath, []];
  }

  // For simple commands like "py -3", split by space
  const parts = pythonPath.split(' ');
  const command = parts[0];
  const baseArgs = parts.slice(1);
  return [command, baseArgs];
}
