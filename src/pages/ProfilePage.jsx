import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Layout/Navbar';

const ProfilePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Error handling for missing context
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Error: AuthContext is not available. Please ensure App is wrapped in AuthProvider.
      </div>
    );
  }

  const { user, setUser, setToken, logout } = authContext;

  // Initialize form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch profile and credits on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsFetching(true);
      try {
        // Fetch profile
        const profileRes = await api.get('/users/profile');
        setName(profileRes.data.name);
        setEmail(profileRes.data.email);
        setUser({ ...user, name: profileRes.data.name, email: profileRes.data.email });

        // Fetch credits
        const creditsRes = await api.get('/credits');
        setCredits(creditsRes.data.credits);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        alert(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password if provided
    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const res = await api.patch('/users/profile', updateData);
      // Update token if returned
      if (res.data.token) {
        setToken(res.data.token);
      }
      // Update user state
      setUser({ ...user, name: res.data.name, email: res.data.email });
      // Update credits
      setCredits(res.data.credits);
      alert('Profile updated successfully! You received 20 additional credits.');
      // Clear password fields
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Profile update failed', err);
      alert(err.response?.data?.message || 'Profile update failed: Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <svg
          className="h-8 w-8 animate-spin text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar credits={credits} user={user} />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Profile
          </h2>
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: <span className="font-medium">{user?.role}</span>
            </p>
            {user?.role === 'admin' && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Admin: You have access to advanced dashboard features.
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white border-none focus:ring-0"
                  placeholder="Name"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white border-none focus:ring-0"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password (Optional)
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white border-none focus:ring-0"
                  placeholder="New Password"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
                </svg>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white border-none focus:ring-0"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="h-5 w-5 animate-spin mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;