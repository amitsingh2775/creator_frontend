import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import SavedFeeds from '../components/Dashboard/SavedFeeds';
import Navbar from '../components/Layout/Navbar';

const SavedFeedsPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Error: AuthContext is not available. Please ensure App is wrapped in AuthProvider.
      </div>
    );
  }

  const { user } = authContext;

  const [savedFeeds, setSavedFeeds] = useState([]);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [feedsRes, creditsRes] = await Promise.all([
          api.get('/feed/saved'),
          api.get('/credits'),
        ]);
        setSavedFeeds(feedsRes.data);
        setCredits(creditsRes.data.credits);
      } catch (err) {
        console.error('Error fetching saved feeds or credits:', err);
        alert(err.response?.data?.message || 'Failed to load saved feeds');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Saved Feeds
          </h1>
          <SavedFeeds
            savedFeeds={savedFeeds}
            isLoading={isLoading}
            onDelete={deleteSavedFeed}
          />
        </div>
      </main>
    </div>
  );
};

export default SavedFeedsPage;