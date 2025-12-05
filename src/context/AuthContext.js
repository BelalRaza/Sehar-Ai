

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

    } catch (err) {
      console.log('No active session');
      setUser(null);

    } finally {
      setLoading(false);
    }
  };

 
  const signup = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);


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
    user,           
    loading,       
    error,        
    signup,        
    login,       
    logout,         
    // resetPassword, 
    checkCurrentUser, 
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