// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to access auth context
// WHY: Simplifies using auth in components - just call useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Error handling: make sure hook is used within AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// USAGE EXAMPLE:
// In any component:
// const { user, login, logout, loading } = useAuth();

// WHAT THIS FILE DOES:
// 1. Provides clean way to access auth context
// 2. Shows error if used incorrectly (outside AuthProvider)
// 3. Returns all auth state and functions