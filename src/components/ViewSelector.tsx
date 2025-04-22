import React from 'react';
import { useThemeStore } from '../store/themeStore';

type ViewType = 'month' | 'week' | 'day';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  const { darkMode } = useThemeStore();

  return (
    <div className="inline-flex space-x-1">
      {(['month', 'week', 'day'] as ViewType[]).map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`
            px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${currentView === view
              ? 'bg-blue-500 text-white'
              : darkMode
                ? 'bg-black text-gray-500 hover:text-gray-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
            focus:outline-none
            capitalize
          `}
        >
          {view}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector; 