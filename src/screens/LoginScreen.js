// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import validation from '../utils/validation';

// LoginScreen Component
// WHY: Provides UI for users to login with email/password
export default function LoginScreen({ navigation }) {
  
  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Get login function from auth context
  // WHY: Access centralized auth logic without prop drilling
  const { login } = useAuth();

  // Handle login button press
  // WHY: Validates inputs and calls login function
  const handleLogin = async () => {
    try {
      console.log('🔐 Login attempt started');
      
      // Validate inputs before API call
      // WHY: Catch errors early, provide better UX
      const validationResult = validation.validateLoginForm(email, password);
      console.log('📋 Validation result:', validationResult);
      
      if (!validationResult.isValid) {
        Alert.alert('Validation Error', validationResult.error);
        return;
      }

      setLocalLoading(true);

      console.log('📤 Sending login request with:', { email });
      
      // Call login from AuthContext
      // WHY: This updates global auth state and triggers re-render
      await login(email, password);
      
      console.log('✅ Login successful!');
      // Success! Navigation happens automatically in App.js
      // WHY: When user state changes, App.js re-renders and shows HomeScreen
      
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        fullError: error
      });
      
      // Show user-friendly error messages
      // WHY: Better UX than showing raw API errors
      const errorMessage = error.message || 'Login failed. Please try again.';
      Alert.alert('Login Error', errorMessage);
      
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to سحر </Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!localLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            editable={!localLoading}
          />
        </View>

        {/* Forgot Password Link */}
        {/* <TouchableOpacity 
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={localLoading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity> */}

        {/* Login Button */}
          <LinearGradient
            colors={["#5AC8FA", "#007AFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <TouchableOpacity 
              style={styles.buttonInside}
              onPress={handleLogin}
              disabled={localLoading}
            >
              {localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

        {/* Signup Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            disabled={localLoading}
          >
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    padding: 15,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonInside: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

// WHAT THIS FILE DOES:
// 1. Provides login form UI with email/password inputs
// 2. Validates inputs before submitting
// 3. Calls login() from AuthContext
// 4. Shows loading state during login
// 5. Displays error messages if login fails
// 6. Navigates to Signup/ForgotPassword screens
// 7. Auto-navigates to HomeScreen on success (via App.js)