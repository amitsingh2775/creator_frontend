import React, { useState } from 'react';
import api from '../../utils/api';

const Feed = ({ feeds, setFeeds, setSavedFeeds, setCredits, fetchFeeds, isLoading = false }) => {
  const [savingFeedId, setSavingFeedId] = useState(null);
  const [reportingFeedId, setReportingFeedId] = useState(null);

  const saveFeed = async (feed) => {
    try {
      setSavingFeedId(feed._id);
      await api.post('/feed/save', {
        title: feed.title,
        link: feed.link,
        source: feed.source,
      });
      const savedRes = await api.get('/feed/saved');
      setSavedFeeds(savedRes.data);
      const creditsRes = await api.get('/credits/');
      setCredits(creditsRes.data.credits);
      alert('Feed saved: The feed has been added to your saved items');
    } catch (err) {
      console.error('Failed to save feed', err);
      alert('Failed to save: There was an error saving this feed');
    } finally {
      setSavingFeedId(null);
    }
  };

  const reportFeed = async (feedId) => {
    try {
      setReportingFeedId(feedId);
      await api.post('/feed/report', { feedId });
      await fetchFeeds();
      alert('Feed reported: Thank you for your feedback');
    } catch (err) {
      console.error('Failed to report feed', err);
      alert('Failed to report: There was an error reporting this feed');
    } finally {
      setReportingFeedId(null);
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Link copied: The link has been copied to your clipboard!');
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Feed</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-[200px] bg-gray-300 rounded-md mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-[120px]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Feed</h2>
        <button
          onClick={fetchFeeds}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <svg
            className="h-4 w-4"
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
      </div>

      {feeds.length === 0 ? (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-10 w-10 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No feeds available
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try refreshing or aggregating LinkedIn feeds to see content here.
          </p>
          <button
            onClick={fetchFeeds}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            Refresh Feeds
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feeds.map((feed) => (
            <div
              key={feed._id}
              className="max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
            >
              {/* Source and Badge */}
              <div className="flex items-center gap-2 mb-3">
                {getSourceIcon(feed.source)}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {feed.source}
                </span>
              </div>

              {/* Title */}
              <a
                href={feed.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
              >
                {feed.title}
              </a>

              {/* Image Preview */}
              {feed.preview ? (
                <div className="relative aspect-video overflow-hidden rounded-md mb-3">
                  <img
                    src={feed.preview}
                    alt={`${feed.title} preview`}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <svg
                    className="h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveFeed(feed)}
                    disabled={savingFeedId === feed._id}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    title="Save this feed to your collection"
                  >
                    {savingFeedId === feed._id ? (
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
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M15 1H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-1 2v10H4V3h10Zm-3 12H7v-1h4v1Z"/>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => copyLink(feed.link)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    title="Copy link to clipboard"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 6h3m-3 0-5-5m0 0v3H6v6h4v3m-4-3h9"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    title="Open in new tab"
                  >
                    <svg
                      className="h-5 w-5"
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
                  </a>
                  <button
                    onClick={() => reportFeed(feed._id)}
                    disabled={reportingFeedId === feed._id}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-lg shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    title="Report this feed"
                  >
                    {reportingFeedId === feed._id ? (
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
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm5 13h4V9H7v5Zm0-7h4V4H7v3Z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;