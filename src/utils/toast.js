// src/utils/toast.js
import { toast } from 'react-toastify';

// Default toast configuration
const defaultConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, defaultConfig);
};

// Error toast
export const showError = (message) => {
  toast.error(message, defaultConfig);
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, defaultConfig);
};

// Warning toast
export const showWarning = (message) => {
  toast.warn(message, defaultConfig);
};

export const ShowToast = (type, message, progress = null) => {
  const Theme  = localStorage.getItem('theme');
  if (type != null && message != null) {
      // If progress is provided (format: "current/total"), add it to the message
      let toastMessage = message;
      if (progress) {
          const [current, total] = progress.split('/');
          if (current && total) {
              toastMessage = `(${current}/${total}) ${message}`;
          }
      }

      const toastOptions = {
          type: type,
          theme: Theme,
          position: 'top-right',
          // Add progress bar if it's a progress notification
          ...(progress && {
              progressStyle: { backgroundColor: type === 'success' ? '#4CAF50' : 
                              type === 'error' ? '#F44336' :
                              type === 'warning' ? '#FFC107' : '#2196F3' },
              autoClose: false // Keep open until manually closed for progress toasts
          })
      };

      // Return the toast ID so you can update or close it later
      return toast(toastMessage, toastOptions);
  }
  return null;
}

// Toast notification for async actions
export const handleAsyncAction = async (promise, { pending, success, error }) => {
  try {
    toast.promise(
      promise,
      {
        pending: pending || 'Action in progress...',
        success: success || 'Action completed successfully!',
        error: {
          render({ data }) {
            return data?.message || error || 'An error occurred';
          },
        },
      },
      defaultConfig
    );
    return await promise;
  } catch (err) {
    throw err;
  }
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  handleAsyncAction,
};