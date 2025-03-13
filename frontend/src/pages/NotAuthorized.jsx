import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './NotAuthorized.scss';

const NotAuthorized = () => {
  const { user } = useSelector(state => state.user);

  return (
    <div className="not-authorized">
      <div className="not-authorized__content">
        <div className="not-authorized__icon">
          <i className="fas fa-lock"></i>
        </div>
        <h1>Access Denied</h1>
        <p>Sorry, you don't have permission to access this page.</p>
        {user?.role && (
          <p className="not-authorized__role">
            Current Role: {Array.isArray(user.role) ? user.role.join(', ') : user.role}
          </p>
        )}
        <div className="not-authorized__actions">
          <Link to="/" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized; 