import React, { useState } from 'react';
import api from '../../utils/api';

const SavedFeeds = ({ savedFeeds, isLoading = false, onDelete }) => {
  const [deletingFeedId, setDeletingFeedId] = useState(null);

  const handleDelete = async (feedId) => {
    if (!onDelete) return;

    const confirmed = window.confirm('Remove saved feed? This will remove the feed from your saved collection. This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeletingFeedId(feedId);
      await onDelete(feedId);
      alert('Feed removed: The feed has been removed from your saved items');
    } catch (err) {
      console.error('Failed to delete feed', err);
      alert('Failed to remove: There was an error removing this feed');
    } finally {
      setDeletingFeedId(null);
    }
  };

  const getSourceIcon = (source) => {
    if (source.toLowerCase().includes('linkedin')) {
      return (
        <svg
          className="h-4 w-4 text-[#0A66C2]"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zM8 19H5V8h3v11zm-1.5-12.5a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 016.5 6.5zm12.5 12.5h-3v-5.5c0-1.378-1.122-2.5-2.5-2.5s-2.5 1.122-2.5 2.5V19h-3V8h3v1.631c.906-.981 2.244-1.631 3.75-1.631 2.981 0 5.25 2.019 5.25 5.5V19z"/>
        </svg>
      );
    } else if (source.toLowerCase().includes('reddit')) {
      return (
        <svg
          className="h-4 w-4 text-[#FF4500]"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 3.66 1.618 6.962 4.197 9.216.375.33.88.234 1.103-.15.224-.385.12-.877-.24-1.154-2.188-1.683-3.54-4.255-3.54-7.112 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.857-1.352 5.429-3.54 7.112-.36.277-.464.769-.24 1.154.223.384.728.48 1.103.15C22.382 18.962 24 15.66 24 12 24 5.373 18.627 0 12 0zm-1.25 14.5c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm2.5 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm2.5 2.5c-.83.73-1.986 1.25-3.25 1.25s-2.42-.52-3.25-1.25c-.385-.34-.985-.24-1.25.22-.265.46-.145 1.06.24 1.38 1.14 1 2.61 1.65 4.26 1.65s3.12-.65 4.26-1.65c.385-.32.505-.92.24-1.38-.265-.46-.865-.56-1.25-.22z"/>
        </svg>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Saved Feeds</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your collection of saved content</p>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0 animate-pulse">
              <div className="h-12 w-12 bg-gray-300 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Saved Feeds</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your collection of saved content</p>
      {savedFeeds.length === 0 ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No saved feeds</h3>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Save interesting feeds to view them later
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedFeeds.map((feed) => (
            <div key={feed._id} className="flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                {getSourceIcon(feed.source)}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {feed.source}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{feed.title}</h3>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={feed.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                    />
                  </svg>
                  View
                </a>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(feed._id)}
                    disabled={deletingFeedId === feed._id}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-lg shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {deletingFeedId === feed._id ? (
                      <svg
                        className="h-4 w-4 animate-spin"
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
                    ) : (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14m-9 4v6m4-6v6"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedFeeds;