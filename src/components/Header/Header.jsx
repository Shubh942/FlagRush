import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  IoIosPaper,
  IoMdChatboxes,
  IoMdMenu,
  IoMdClose,
  IoMdLogOut,
  IoMdPerson,
} from 'react-icons/io';
import { BsChatRightDotsFill, BsChevronDown, BsGearFill } from 'react-icons/bs';
import { RiGroupFill } from 'react-icons/ri';
import { FaChessKing } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
  const { user, setOpenProfile, isUserLoggedIn } = ChatState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <IoIosPaper />, text: 'CTFs', path: '/' },
    { icon: <IoMdChatboxes />, text: 'Discussion', path: 'discussion' },
    { icon: <BsChatRightDotsFill />, text: 'Chat', path: 'chat' },
    { icon: <RiGroupFill />, text: 'Social', path: 'social' },
    { icon: <FaChessKing />, text: 'Contests', path: 'future-scope' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    isUserLoggedIn.current = false;
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
    toast.success('Logged out successfully', {
      autoClose: 1500,
      position: 'top-center',
    });
  };

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="logo-container"
        >
          <Link to="/" className="logo">
            <span className="logo-gradient">FlagRush</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* User Controls */}
        <div className="user-controls">
          {isUserLoggedIn.current ? (
            <div className="user-wrapper">
              <motion.div
                className="user-profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                whileHover={{ scale: 1.02 }}
              >
                {user?.data?.user?.photo ? (
                  <div className="avatar-container">
                    <img
                      src={user.data.user.photo}
                      alt={user.data.user.name}
                      className="user-avatar"
                    />
                  </div>
                ) : (
                  <div className="avatar-fallback">
                    {user?.data?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <BsChevronDown
                  className={`dropdown-arrow ${
                    profileDropdownOpen ? 'open' : ''
                  }`}
                />
              </motion.div>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <button
                      className="dropdown-option"
                      onClick={() => {
                        navigate(
                          `profile/${
                            JSON.parse(localStorage.getItem('userInfo'))
                              ? JSON.parse(localStorage.getItem('userInfo'))
                                  .data.user.name
                              : ''
                          }`
                        );
                        setOpenProfile(true);
                        setProfileDropdownOpen(false);
                      }}
                    >
                      <IoMdPerson className="option-icon" />
                      <span>Profile</span>
                    </button>
                    <button
                      className="dropdown-option"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                      }}
                    >
                      <BsGearFill className="option-icon" />
                      <span>Settings</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-option logout"
                      onClick={handleLogout}
                    >
                      <IoMdLogOut className="option-icon" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="auth-btn">
                Sign In
              </Link>
            </motion.div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <IoMdClose className="toggle-icon" />
            ) : (
              <IoMdMenu className="toggle-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <nav className="mobile-nav">
              <ul className="mobile-menu">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `mobile-link ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-icon">{item.icon}</span>
                      <span>{item.text}</span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              {isUserLoggedIn.current && (
                <div className="mobile-auth">
                  <button className="mobile-logout" onClick={handleLogout}>
                    <IoMdLogOut className="mobile-logout-icon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'var(--bg-darker)',
          color: 'var(--text-light)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}
      />
    </header>
  );
};

export default Header;
