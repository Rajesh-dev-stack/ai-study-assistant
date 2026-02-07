import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
        isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
