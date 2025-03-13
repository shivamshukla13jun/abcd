import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import profilePic from "@assets/icons/ic-user.png";
import { useDispatch } from "react-redux";
import { logout } from "@redux/Slice/UserSlice";
import "./Header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const [notifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "Order #12345 has been placed",
      time: "5 min ago",
      isRead: false
    },
    {
      id: 2,
      title: "Payment Processed",
      message: "Payment for order #12344 is complete",
      time: "1 hour ago",
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
      className="nav-icon"
    >
      {children}
    </a>
  ));

  return (
    <Navbar expand="lg" className="header-navbar">
      <Container fluid className="p-0">
        <h1 className="brand-title">TMS</h1>

        <Nav className="ms-auto d-flex align-items-center gap-3">
          {/* Notifications Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle}>
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="header-dropdown">
              <div className="px-3 py-2 border-bottom">
                <h6 className="mb-0">Notifications</h6>
              </div>
              {notifications.map(notification => (
                <Dropdown.Item key={notification.id} className="notification-item">
                  <div className="notification-title">{notification.title}</div>
                  <div className="text-muted small">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <div className="text-center p-2">
                <a href="#" className="text-decoration-none small">View All Notifications</a>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle}>
              <img
                src={profilePic}
                alt="Profile"
                className="profile-image"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="header-dropdown">
              <div className="px-3 py-2 d-flex align-items-center gap-3 border-bottom">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="profile-image"
                  style={{ width: 48, height: 48 }}
                />
                <div>
                  <h6 className="mb-0">John Doe</h6>
                  <small className="text-muted">Administrator</small>
                </div>
              </div>
              <Dropdown.Item className="profile-dropdown-item">
                <FaUserCircle className="profile-dropdown-icon" />
                View Profile
              </Dropdown.Item>
              <Dropdown.Item className="profile-dropdown-item">
                <FaUserEdit className="profile-dropdown-icon" />
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item className="profile-dropdown-item">
                <FaCog className="profile-dropdown-icon" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                className="profile-dropdown-item text-danger"
                onClick={() => dispatch(logout())}
              >
                <FaSignOutAlt className="profile-dropdown-icon" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
