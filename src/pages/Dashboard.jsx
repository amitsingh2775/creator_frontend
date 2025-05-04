import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Feed from '../components/Dashboard/Feed';
import SavedFeeds from '../components/Dashboard/SavedFeeds';
import AdminPanel from '../components/Dashboard/AdminPanel';
import Navbar from '../components/Layout/Navbar';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [credits, setCredits] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAggregating, setIsAggregating] = useState(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Error: AuthContext is not available. Please ensure App is wrapped in AuthProvider.
      </div>
    );
  }

  const { user } = authContext;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          checkLoginBonus(),
          fetchCredits(),
          fetchFeeds(),
          fetchSavedFeeds(),
          user?.role === 'admin' && fetchAllUsers(),
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data: There was a problem loading your dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const checkLoginBonus = async () => {
    try {
      const res = await api.get('/users/login-bonus');
      if (res.data.awarded) {
        setCredits(res.data.credits);
        toast.success(res.data.message, {
          icon: '🎉',
        });
      }
    } catch (err) {
      console.error('Failed to check login bonus', err);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await api.get('/credits');
      setCredits(res.data.credits);
    } catch (err) {
      console.error('Failed to fetch credits', err);
      throw err;
    }
  };

  const fetchFeeds = async () => {
    try {
      const allFeedsRes = await api.get('/feed/all');
      let combinedFeeds = allFeedsRes.data;

      const redditRes = await api.get('/feed/aggregate/reddit');
      const linkedinRes = await api.get('/feed/aggregate/linkedin');

      combinedFeeds = [...combinedFeeds, ...redditRes.data.feeds, ...linkedinRes.data.feeds].reduce((unique, feed) => {
        return unique.some((f) => f._id === feed._id) ? unique : [...unique, feed];
      }, []);

      setFeeds(combinedFeeds);
    } catch (err) {
      console.error('Failed to fetch feeds', err);
      throw err;
    }
  };

  const fetchSavedFeeds = async () => {
    try {
      const res = await api.get('/feed/saved');
      setSavedFeeds(res.data);
    } catch (err) {
      console.error('Failed to fetch saved feeds', err);
      throw err;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const aggregateLinkedInFeeds = async () => {
    try {
      setIsAggregating(true);
      const res = await api.get('/feed/aggregate/linkedin');
      await fetchFeeds();
      toast.success(res.data.message || 'Successfully aggregated LinkedIn feeds');
    } catch (err) {
      console.error('Failed to aggregate LinkedIn feeds', err);
      toast.error('Aggregation failed: Failed to aggregate LinkedIn feeds');
    } finally {
      setIsAggregating(false);
    }
  };

  const deleteSavedFeed = async (feedId) => {
    try {
      await api.delete(`/feed/saved/${feedId}`);
      setSavedFeeds((prev) => prev.filter((feed) => feed._id !== feedId));
      return true;
    } catch (err) {
      console.error('Failed to delete saved feed', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar credits={credits} user={user} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Manage users, feeds, and content aggregation' : 'Browse and manage your content feeds'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fetchFeeds}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.1679 8C19.6247 4.46819 16.1006 2 12 2C6.81465 2 2.5511 5.94668 2.04932 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0493 22C17.2347 22 21.4982 18.0533 22 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Refresh
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={aggregateLinkedInFeeds}
                  disabled={isAggregating || isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4 text-[#0A66C2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zM8 19H5V8h3v11zm-1.5-12.5a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 016.5 6.5zm12.5 12.5h-3v-5.5c0-1.378-1.122-2.5-2.5-2.5s-2.5 1.122-2.5 2.5V19h-3V8h3v1.631c.906-.981 2.244-1.631 3.75-1.631 2.981 0 5.25 2.019 5.25 5.5V19z"/>
                  </svg>
                  {isAggregating ? 'Aggregating...' : 'Aggregate LinkedIn'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                <Feed
                  feeds={feeds}
                  setFeeds={setFeeds}
                  setSavedFeeds={setSavedFeeds}
                  setCredits={setCredits}
                  fetchFeeds={fetchFeeds}
                  isLoading={isLoading}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                <div className="space-y-6">
                  <SavedFeeds
                    savedFeeds={savedFeeds}
                    isLoading={isLoading}
                    onDelete={deleteSavedFeed}
                  />
                  {user?.role === 'admin' && <AdminPanel allUsers={allUsers} setAllUsers={setAllUsers} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;