import { execSync } from 'child_process';

/**
 * Detect and return the best available Python command.
 * Tries multiple candidates and returns the first one that works with Python 3.
 *
 * @returns The Python command to use, or null if none found
 */
export function findPythonCommand(): string | null {
  const isWindows = process.platform === 'win32';

  // On Windows, try py launcher first (most reliable), then python, then python3
  // On Unix, try python3 first, then python
  const candidates = isWindows
    ? ['py -3', 'python', 'python3', 'py']
    : ['python3', 'python'];

  for (const cmd of candidates) {
    try {
      const version = execSync(`${cmd} --version`, {
        stdio: 'pipe',
        timeout: 5000,
        windowsHide: true
      }).toString();

      if (version.includes('Python 3')) {
        return cmd;
      }
    } catch {
      // Command not found or errored, try next
      continue;
    }
  }

  // Fallback to platform-specific default
  return isWindows ? 'python' : 'python3';
}

/**
 * Get the default Python command for the current platform.
 * This is a synchronous fallback that doesn't test if Python actually exists.
 *
 * @returns The default Python command for this platform
 */
export function getDefaultPythonCommand(): string {
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Parse a Python command string into command and base arguments.
 * Handles space-separated commands like "py -3", but preserves paths with spaces.
 *
 * @param pythonPath - The Python command string (e.g., "python3", "py -3", "/path/with spaces/python")
 * @returns Tuple of [command, baseArgs] ready for use with spawn()
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
