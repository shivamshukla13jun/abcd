import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronLeft, FaBars } from "react-icons/fa";
import { protectedRoutes } from "@/routes/routes";
import { toggleSidebar } from "@redux/Slice/sidebarSlice";
import * as FaIcons from "react-icons/fa";
import { logout } from "@redux/Slice/UserSlice";
import "./Sidebar.scss";

const MenuItem = ({ item, level = 0, collapsed, hasAccess, location }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const formattedName = `Fa${iconName.charAt(0).toUpperCase() + iconName.slice(1)}`;
    return FaIcons[formattedName] ? React.createElement(FaIcons[formattedName]) : null;
  };

  const handleClick = (e) => {
    if (item.children) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const paddingLeft = `${level * 20 + 20}px`;

  return (
    <div className="nav-item-container">
      <Nav.Item className="d-flex align-items-center">
        <Link
          to={item.children ? "#" : item.path}
          className={`nav-link d-flex align-items-center ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={handleClick}
          style={{
            padding: "12px 20px",
            paddingLeft,
            color: "#fff",
            opacity: "0.8",
            transition: "all 0.3s ease",
            width: "100%",
            borderRadius: "8px",
            margin: "2px 8px",
          }}
        >
          <span className="me-3" style={{ width: "20px", textAlign: "center" }}>
            {getIcon(item.icon)}
          </span>
          {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.title}</span>}
          {item.children && !collapsed && (
            <FaChevronDown
              className="ms-auto"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s ease"
              }}
            />
          )}
        </Link>
      </Nav.Item>

      {item.children && isOpen && !collapsed && (
        <Nav className="flex-column submenu">
          {item.children
            .filter(child => hasAccess(child.allowedRoles))
            .map((child, index) => (
              <MenuItem
                key={index}
                item={child}
                level={level + 1}
                collapsed={collapsed}
                hasAccess={hasAccess}
                location={location}
              />
            ))}
        </Nav>
      )}
    </div>
  );
};

const Sidebar = () => {
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  // Check if user has access to the route
  const hasAccess = (allowedRoles) => {
    if (!allowedRoles || !user?.role) return false;
    return Array.isArray(user.role)
      ? user.role.some(role => allowedRoles.includes(role))
      : allowedRoles.includes(user.role);
  };

  // Filter routes based on user role and hideInMenu property
  const visibleRoutes = protectedRoutes.filter(
    route => !route.hideInMenu && hasAccess(route.allowedRoles)
  );

  return (
    <div
      className={`sidebar-bg sidebar-text ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
      style={{
        width: collapsed ? "80px" : "250px",
        height: "100vh",
        position: "fixed",
        transition: "all 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        backgroundColor: "#1a237e",
        color: "#fff",
      }}
    >
      <div className="d-flex align-items-center p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {!collapsed && (
          <div className="me-auto" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
            Dashboard
          </div>
        )}
        <button
          className="toggle-btn"
          onClick={() => dispatch(toggleSidebar())}
          style={{
            border: "none",
            background: "transparent",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            transition: "all 0.3s ease",
            marginLeft: collapsed ? "auto" : "0",
            marginRight: collapsed ? "auto" : "0",
          }}
        >
          {collapsed ? <FaBars size={20} /> : <FaChevronLeft size={20} />}
        </button>
      </div>

      <Nav className="flex-column py-2">
        {visibleRoutes.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            collapsed={collapsed}
            hasAccess={hasAccess}
            location={location}
          />
        ))}

        <Nav.Item>
          <Link
            to="/settings"
            className={`nav-link d-flex align-items-center ${
              location.pathname === "/settings" ? "active" : ""
            }`}
            style={{
              padding: "12px 20px",
              color: "#fff",
              opacity: "0.8",
              transition: "all 0.3s ease",
              margin: "2px 8px",
              borderRadius: "8px",
            }}
          >
            <span className="me-3" style={{ width: "20px", textAlign: "center" }}>
              <FaIcons.FaCog />
            </span>
            {!collapsed && <span>Settings</span>}
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            onClick={() => dispatch(logout())}
            to="#"
            className="nav-link d-flex align-items-center"
            style={{
              padding: "12px 20px",
              color: "#fff",
              opacity: "0.8",
              transition: "all 0.3s ease",
              margin: "2px 8px",
              borderRadius: "8px",
            }}
          >
            <span className="me-3" style={{ width: "20px", textAlign: "center" }}>
              <FaIcons.FaSignOutAlt />
            </span>
            {!collapsed && <span>Logout</span>}
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
