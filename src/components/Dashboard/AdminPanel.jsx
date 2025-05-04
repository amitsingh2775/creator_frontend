import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminPanel = ({ allUsers, setAllUsers }) => {
  const [isAddingCredits, setIsAddingCredits] = useState(null);
  const [creditsInput, setCreditsInput] = useState({});
  const [isChangingRole, setIsChangingRole] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    reportedPosts: 0,
    savedPosts: 0,
    activeUsers: 0
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        alert('Failed to load analytics data');
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleAddCredits = async (userId) => {
    const creditsToAdd = parseInt(creditsInput[userId]) || 0;
    if (creditsToAdd <= 0) {
      alert('Please enter a valid number of credits');
      return;
    }

    try {
      setIsAddingCredits(userId);
      await api.post(`/admin/add-credits/${userId}`, { credits: creditsToAdd });
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, credits: u.credits + creditsToAdd } : u
        )
      );
      alert(`${creditsToAdd} credits added to user`);
      setCreditsInput((prev) => ({ ...prev, [userId]: '' }));
    } catch (err) {
      console.error('Failed to add credits', err);
      alert('Failed to add credits: There was an error adding credits');
    } finally {
      setIsAddingCredits(null);
    }
  };

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      setIsChangingRole(userId);
      await api.post(`/admin/change-role/${userId}`, { role: newRole });
      setAllUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      alert(`User role changed to ${newRole}`);
    } catch (err) {
      console.error('Failed to change role', err);
      alert('Failed to update role: There was an error changing the user role');
    } finally {
      setIsChangingRole(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
            Admin
          </span>
        );
      case 'premium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500 text-white">
            Premium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            User
          </span>
        );
    }
  };

  return (
    <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          Admin Panel
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage users, credits, and view analytics</p>
      </div>

      {/* Feed Usage Analytics Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feed Usage Analytics</h3>
        {isLoadingAnalytics ? (
          <div className="flex justify-center">
            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalPosts}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Reported Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.reportedPosts}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Saved Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.savedPosts}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.activeUsers}</p>
            </div>
          </div>
        )}
      </div>

      {/* User List Section */}
      <div className="overflow-x-auto border border-gray-200 rounded-md dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              allUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isAddingCredits === user._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={creditsInput[user._id] || ''}
                          onChange={(e) =>
                            setCreditsInput((prev) => ({
                              ...prev,
                              [user._id]: e.target.value,
                            }))
                          }
                          className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                          placeholder="Credits"
                          min="1"
                        />
                        <button
                          onClick={() => handleAddCredits(user._id)}
                          disabled={isAddingCredits === user._id}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-500"
                        >
                          <svg
                            className={`h-5 w-5 ${isAddingCredits === user._id ? 'animate-spin' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-900 dark:text-white">{user.credits}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          const dropdown = document.getElementById(`dropdown-${user._id}`);
                          dropdown.classList.toggle('hidden');
                        }}
                      >
                        <svg
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        <span className="sr-only">Open menu</span>
                      </button>
                      <div
                        id={`dropdown-${user._id}`}
                        className="hidden absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg text-gray-800 z-10 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <div className="p-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">Actions</div>
                        <button
                          onClick={() => {
                            setIsAddingCredits(user._id);
                            const dropdown = document.getElementById(`dropdown-${user._id}`);
                            dropdown.classList.add('hidden');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-2h-4v-2h4v2z"/>
                          </svg>
                          Add Credits
                        </button>
                        <button
                          onClick={() => {
                            changeRole(user._id, user.role);
                            const dropdown = document.getElementById(`dropdown-${user._id}`);
                            dropdown.classList.add('hidden');
                          }}
                          disabled={isChangingRole === user._id}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <svg
                            className={`h-4 w-4 ${isChangingRole === user._id ? 'animate-spin' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;