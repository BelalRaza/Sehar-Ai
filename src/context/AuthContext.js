// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create Context
// WHY: Allows any component to access auth state without prop drilling
export const AuthContext = createContext();

// AuthProvider Component
// WHY: Wraps app to provide auth state to all children
export const AuthProvider = ({ children }) => {
  
  // State: current user object (null if not logged in)
  const [user, setUser] = useState(null);
  
  // State: loading indicator while checking auth status
  const [loading, setLoading] = useState(true);
  
  // State: error messages
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  // WHY: Restore session if user was previously logged in
  useEffect(() => {
    checkCurrentUser();
  }, []); // Run once on mount

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser); // Set user if logged in, null if not
      
    } catch (err) {
      console.log('No active session');
      setUser(null);
      
    } finally {
      setLoading(false); // Done checking
    }
  };

  // Signup function
  // WHY: Wrapper to signup and update context state
  const signup = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create account
      await authService.signup(email, password, name);
      
      // Auto-login after signup
      await login(email, password);
      
    } catch (err) {
      setError(err.message);
      throw err;
      
    } finally {
      setLoading(false);
    }
  };

  // Login function
  // WHY: Login and store user in context
  const login = async (email, password) => {
    try {
       console.log('🔐 AuthContext.login() called');
      setError(null);
      setLoading(true);
      
       console.log('📞 Calling authService.login()...');
      await authService.login(email, password);
       console.log('✓ authService.login() completed');
      
      // Get user details after login
       console.log('👤 Fetching current user...');
      const currentUser = await authService.getCurrentUser();
       console.log('👤 Current user fetched:', currentUser);
      setUser(currentUser);
       console.log('✅ User state updated, login complete!');
      
    } catch (err) {
       console.error('❌ AuthContext.login() error:', err.message);
      setError(err.message);
      throw err;
      
    } finally {
       console.log('🔄 Setting loading to false');
      setLoading(false);
    }
  };

  // Logout function
  // WHY: Logout and clear user from context
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      
      await authService.logout();
      setUser(null); // Clear user state
      
    } catch (err) {
      setError(err.message);
      throw err;
      
    } finally {
      setLoading(false);
    }
  };

  // Reset password (send email)
//   const resetPassword = async (email, redirectUrl) => {
//     try {
//       setError(null);
//       await authService.resetPasswordInit(email, redirectUrl);
      
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

  // Value object to share across app
  // WHY: All auth-related data and functions in one place
  const value = {
    user,           // Current user object
    loading,        // Loading state
    error,          // Error messages
    signup,         // Signup function
    login,          // Login function
    logout,         // Logout function
    // resetPassword,  // Password reset function
    checkCurrentUser, // Refresh user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// WHAT THIS FILE DOES:
// 1. Creates a global auth state accessible anywhere
// 2. Checks if user is logged in on app start
// 3. Provides signup/login/logout functions to all components
// 4. Manages loading and error states
// 5. Auto-updates UI when auth state changes