import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const { darkMode } = useThemeStore();

  const getToastStyles = () => {
    const baseStyles = 'fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center';
    const typeStyles = {
      success: darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800',
      error: darkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800',
      info: darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800',
    };
    return `${baseStyles} ${typeStyles[type]}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={getToastStyles()}
        >
          <span className="mr-2">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-sm font-medium hover:opacity-80"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 