import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ credits, user }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Error: AuthContext is not available.
      </div>
    );
  }

  const { logout } = authContext;

  const handleLogout = () => {
    logout();
    alert('Logged out: You have been successfully logged out');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Saved Feeds', href: '/saved' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900 dark:text-white">FeedHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Credits and User Menu */}
        <div className="flex items-center gap-4">
          {/* Credits (Visible on Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <svg
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-2h-4v-2h4v2z"/>
            </svg>
            <span>{credits} Credits</span>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg text-gray-800 z-10 dark:bg-gray-800 dark:text-gray-200">
                <div className="p-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">My Account</div>
                <div className="md:hidden flex items-center gap-2 px-4 py-2 text-sm">
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-2h-4v-2h4v2z"/>
                  </svg>
                  <span>{credits} Credits</span>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/buy-credits');
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-2h-4v-2h4v2z"/>
                  </svg>
                  Buy Credits
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <nav className="grid gap-2 py-6 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;