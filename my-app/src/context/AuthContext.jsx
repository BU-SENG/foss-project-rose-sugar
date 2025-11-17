import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from localStorage or session)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // If using JWT, check if token needs refresh
          const refreshToken = localStorage.getItem('auth_refresh');
          if (refreshToken) {
            await refreshAccessToken();
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Refresh JWT token using refresh token (Django JWT)
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('auth_refresh');
      if (!refreshToken) return false;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: import.meta.env.VITE_DJANGO_BACKEND === 'true' ? 'include' : 'omit',
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.access);
        return true;
      } else {
        // Refresh token expired, user needs to log in again
        logout();
        return false;
      }
    } catch (err) {
      console.error('Error refreshing token:', err);
      logout();
      return false;
    }
  };

  const login = (userData, token, refreshToken = null) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) localStorage.setItem('auth_token', token);
    if (refreshToken) localStorage.setItem('auth_refresh', refreshToken);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh');
    
    // Optional: Notify backend of logout
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        credentials: import.meta.env.VITE_DJANGO_BACKEND === 'true' ? 'include' : 'omit',
      });
    } catch (err) {
      console.error('Error notifying backend of logout:', err);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
