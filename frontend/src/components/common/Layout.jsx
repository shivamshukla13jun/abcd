import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.scss';

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`layout ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isExpanded={isSidebarExpanded} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;