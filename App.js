// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { ElevenLabsProvider } from '@elevenlabs/react-native';
// import Gradient from './src/components/Gradient';

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SessionScreen from './src/screens/SessionScreen';
// import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

// Navigation Logic Component
// WHY: Decides which screens to show based on auth state
function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth status
  // WHY: Prevents flash of wrong screen during auth check
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5794dfff" />
      </View>
    );
  }

  return (

    <NavigationContainer>

      <Stack.Navigator

      // screenOptions={{
      //   headerStyle: { backgroundColor: '#6200ee' },
      //   headerTintColor: '#fff',
      //   headerTitleStyle: { fontWeight: 'bold' },
      // }}
      >



        {user ? (
          // User is logged in - show protected screens
          // WHY: Authenticated users see app content
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // options={{ title: 'Welcome' }}
            />
            <Stack.Screen
              name="Session"
              component={SessionScreen}
              options={{ title: 'Session' }}
            />
          </>
        ) : (
          // User is NOT logged in - show auth screens
          // WHY: Unauthenticated users must login/signup first
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }} // Hide header on login
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            // options={{ title: 'Create Account' }}
            />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component
// WHY: Wraps everything with AuthProvider to enable global auth state
export default function App() {
  return (
    <AuthProvider>
      <ElevenLabsProvider>
        <AppNavigator />
      </ElevenLabsProvider>
    </AuthProvider>
  );
}

// WHAT THIS FILE DOES:
// 1. Wraps entire app with AuthProvider (enables useAuth() everywhere)
// 2. Sets up navigation with React Navigation
// 3. Shows loading spinner during auth check
// 4. Conditionally renders screens based on login status
// 5. User logged in? → Show HomeScreen
// 6. User NOT logged in? → Show Login/Signup screens

// REQUIRED PACKAGES (install if you haven't):
// npm install @react-navigation/native @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context