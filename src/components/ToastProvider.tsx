import React from 'react';
import { useToastStore } from '../store/toastStore';
import Toast from './Toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { message, type, isVisible, hideToast } = useToastStore();

  return (
    <>
      {children}
      <Toast
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default ToastProvider; 