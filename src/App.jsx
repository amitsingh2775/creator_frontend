import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SavedFeedsPage from './pages/SavedFeedsPage';
import ProfilePage from './pages/ProfilePage';

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Error handling for missing context
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Error: AuthContext is not available. Please ensure App is wrapped in AuthProvider.
      </div>
    );
  }

  const { user, loading } = authContext;

  // Show loading indicator while checking authentication
  if (loading) {
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

  // Redirect to login if not authenticated, otherwise render children
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedFeedsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><div>Settings Page</div></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy-credits"
            element={<ProtectedRoute><div>Buy Credits Page</div></ProtectedRoute>}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;