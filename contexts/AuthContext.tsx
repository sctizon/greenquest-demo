import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load token from SecureStore on app startup
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          console.log('Token loaded:', storedToken);
          setIsAuthenticated(true); // User is authenticated if a token exists
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false); // Finished loading
      }
    };
    loadToken();
  }, []);

  // Login: Save the token and set authentication state
  const login = async (token: string) => {
    try {
      // Save the token directly (assuming it's already a string)
      await SecureStore.setItemAsync('authToken', token);
      console.log('Token saved:', JSON.stringify(token));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // Logout: Remove the token and reset authentication state
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken'); // Remove token
      console.log('Token removed');
      setIsAuthenticated(false); // Reset authentication state
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
