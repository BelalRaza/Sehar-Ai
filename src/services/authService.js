// src/services/authService.js

import { account, ID } from '../config/appwrite';

// Authentication Service
// WHY: Separates business logic from UI components - cleaner, testable, reusable

const authService = {
  
  // Create new user account
  // WHY: Handles user registration with email & password
  //Your authService uses it for the core functions of an application.
  //account object contains all the methods necessary to manage users and their login status.
  async signup(email, password, name) {
    try {
      // ID.unique() generates a unique user ID automatically
      const user = await account.create(
        ID.unique(),  // Unique user ID
        email,        // User's email
        password,     // User's password (Appwrite handles hashing)
        name          // User's display name
      );
      
      console.log('✅ Signup successful:', user);
      return user;
      
    } catch (error) {
      console.error('❌ Signup error:', error.message);
      throw error; // Re-throw so caller can handle it
    }
  },

  // Login user with email & password
  // WHY: Creates a session for authenticated user
  async login(email, password) {
    try {
       console.log('🔑 authService.login() called with email:', email);
      // Creates an email session (logs user in)
       console.log('⏳ Attempting account.createEmailPasswordSession...');
      const session = await account.createEmailPasswordSession(
        email,
        password
      );
      
       console.log('✅ Session created:', { sessionId: session.$id, userId: session.userId });
      console.log('✅ Login successful:', session);
      return session;
      
    } catch (error) {
       console.error('❌ Login error caught:', {
         message: error.message,
         code: error.code,
         status: error.status,
         type: error.type,
         fullError: error
       });
      console.error('❌ Login error:', error.message);
      throw error;
    }
  },

  // Logout current user
  // WHY: Ends user session and clears authentication
  async logout() {
    try {
      // Deletes the current session
      await account.deleteSession('current');
      console.log('✅ Logout successful');
      
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      throw error;
    }
  },

  // Get currently logged-in user
  // WHY: Check if user is authenticated and get their info
  async getCurrentUser() {
    try {
      // Gets account details of logged-in user
      const user = await account.get();
      console.log('✅ Current user:', user);
      return user;
      
    } catch (error) {
      console.log('❌ No user logged in:', error.message);
      return null; // Return null if no user (not an error)
    }
  },

  // === ADVANCED METHODS (Stage 2) ===

  // Send password recovery email
  // WHY: Allows users to reset forgotten passwords


//   async resetPasswordInit(email, redirectUrl) {
//     try {
//       // Sends password reset email to user
//       await account.createRecovery(
//         email,
//         redirectUrl // URL where user completes password reset
//       );
//       console.log('✅ Password reset email sent');
      
//     } catch (error) {
//       console.error('❌ Password reset error:', error.message);
//       throw error;
//     }
//   },

//   // Complete password reset with code from email
//   // WHY: Actually changes the password after user clicks email link
//   async resetPasswordComplete(userId, secret, password) {
//     try {
//       await account.updateRecovery(
//         userId,   // User ID from email link
//         secret,   // Secret code from email link
//         password  // New password
//       );
//       console.log('✅ Password reset successful');
      
//     } catch (error) {
//       console.error('❌ Password reset completion error:', error.message);
//       throw error;
//     }
//   },

//   // Send email verification
//   // WHY: Verify user owns the email address
//   async sendVerificationEmail(redirectUrl) {
//     try {
//       await account.createVerification(redirectUrl);
//       console.log('✅ Verification email sent');
      
//     } catch (error) {
//       console.error('❌ Verification email error:', error.message);
//       throw error;
//     }
//   },

//   // Confirm email verification
//   // WHY: Complete verification after user clicks email link
//   async confirmEmailVerification(userId, secret) {
//     try {
//       await account.updateVerification(userId, secret);
//       console.log('✅ Email verified successfully');
      
//     } catch (error) {
//       console.error('❌ Email verification error:', error.message);
//       throw error;
//     }
//   },

//   // Update user name
//   // WHY: Allow users to change their display name
//   async updateName(name) {
//     try {
//       const user = await account.updateName(name);
//       console.log('✅ Name updated:', user);
//       return user;
      
//     } catch (error) {
//       console.error('❌ Name update error:', error.message);
//       throw error;
//     }
//   },

  // Update user password (when logged in)
  // WHY: Allow users to change password from settings
//   async updatePassword(newPassword, oldPassword) {
//     try {
//       await account.updatePassword(newPassword, oldPassword);
//       console.log('✅ Password updated');
      
//     } catch (error) {
//       console.error('❌ Password update error:', error.message);
//       throw error;
//     }
//   },

// };
}
export default authService;
  
// WHAT THIS FILE DOES:
// 1. Wraps Appwrite account methods in clean, reusable functions
// 2. Handles errors gracefully with try-catch
// 3. Logs operations for debugging
// 4. Provides both basic (signup/login/logout) and advanced features
// 5. Can be imported and used anywhere in the app