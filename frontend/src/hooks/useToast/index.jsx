// src/components/Toast.js

import React, { useEffect } from 'react';
import './toast.scss'; // Styles for the toast

const Toast = ({ message, show, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close the toast after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-message">
        <strong>{type === 'error' ? 'Error!' : 'Success!'}</strong>
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>✖</button>
    </div>
  );
};

export default Toast;
