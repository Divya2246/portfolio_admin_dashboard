import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dashboard-theme';

function readTheme(): 'dark' | 'light' {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) return 'light';
  return 'dark';
}

export function applyTheme(theme: 'dark' | 'light') {
  document.documentElement.classList.toggle('light', theme === 'light');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore private-mode storage failures */
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setTheme(next)}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}
