// src/utils/validation.js

// Validation utility functions
// WHY: Reusable validation logic, consistent error messages

const validation = {
  
  // Validate email format
  // WHY: Ensure email is valid before sending to Appwrite
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    return { isValid: true, error: null };
  },

  // Validate password strength
  // WHY: Ensure password meets security requirements
  validatePassword: (password) => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    
    // Optional: Add more rules (uppercase, numbers, symbols)
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasNumber = /[0-9]/.test(password);
    // if (!hasUpperCase || !hasNumber) {
    //   return { isValid: false, error: 'Password must contain uppercase and number' };
    // }
    
    return { isValid: true, error: null };
  },

  // Validate name
  // WHY: Ensure name is not empty
  validateName: (name) => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters' };
    }
    
    return { isValid: true, error: null };
  },

  // Validate passwords match
  // WHY: Confirm password in signup/reset flows
  validatePasswordMatch: (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true, error: null };
  },

  // Validate all signup fields at once
  // WHY: Convenient function for signup form
  validateSignupForm: (email, password, name, confirmPassword) => {
    const emailCheck = validation.validateEmail(email);
    if (!emailCheck.isValid) return emailCheck;
    
    const nameCheck = validation.validateName(name);
    if (!nameCheck.isValid) return nameCheck;
    
    const passwordCheck = validation.validatePassword(password);
    if (!passwordCheck.isValid) return passwordCheck;
    
    const matchCheck = validation.validatePasswordMatch(password, confirmPassword);
    if (!matchCheck.isValid) return matchCheck;
    
    return { isValid: true, error: null };
  },

  // Validate login form
  // WHY: Check email and password before login
  validateLoginForm: (email, password) => {
    const emailCheck = validation.validateEmail(email);
    if (!emailCheck.isValid) return emailCheck;
    
    const passwordCheck = validation.validatePassword(password);
    if (!passwordCheck.isValid) return passwordCheck;
    
    return { isValid: true, error: null };
  },

};

export default validation;

// WHAT THIS FILE DOES:
// 1. Centralizes all input validation logic
// 2. Provides consistent error messages
// 3. Returns structured validation results
// 4. Prevents invalid data from reaching Appwrite
// 5. Can be easily extended with more rules