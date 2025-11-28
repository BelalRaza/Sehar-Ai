// src/config/appwrite.js

import { Client, Account, ID } from 'react-native-appwrite';

// Appwrite configuration object
// WHY: Centralized config makes it easy to update credentials in one place
const appwriteConfig = {
  endpoint: 'https://tor.cloud.appwrite.io/v1', // Your Appwrite server URL
  projectId: '69296eb80009f1d5c2e2',        // Replace with your actual Project ID
  platform: 'com.sehar',                  // Your app's package name
};

// Initialize the Appwrite client
// WHY: This creates the main connection to Appwrite services
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Tell client where Appwrite server is
  .setProject(appwriteConfig.projectId) // Tell client which project to use
  .setPlatform(appwriteConfig.platform); // Identify your app

// Create Account service instance
// WHY: Account handles all authentication operations (login, signup, etc.)
const account = new Account(client);

// Export everything we need
export { client, account, ID, appwriteConfig };

// WHAT THIS FILE DOES:
// 1. Creates a client connection to Appwrite
// 2. Configures it with your project details
// 3. Exports the account service for authentication operations
// 4. Exports ID utility for generating unique IDs