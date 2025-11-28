// src/screens/SignupScreen.js

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
import { useAuth } from '../hooks/useAuth';
import validation from '../utils/validation';
import { LinearGradient } from 'expo-linear-gradient';
import Gradient from '../components/Gradient';

// SignupScreen Component
// WHY: Provides UI for new users to create account
export default function SignupScreen({ navigation }) {
  
  // Local state for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Get signup function from auth context
  const { signup } = useAuth();

  // Handle signup button press
  // WHY: Validates all inputs and creates new account
  const handleSignup = async () => {
    try {
      // Validate all signup fields
      // WHY: Ensure data quality before sending to Appwrite
      const validationResult = validation.validateSignupForm(
        email, 
        password, 
        name, 
        confirmPassword
      );
      
      if (!validationResult.isValid) {
        Alert.alert('Validation Error', validationResult.error);
        return;
      }

      setLocalLoading(true);

      // Call signup from AuthContext
      // WHY: Creates account AND auto-logs in user
      await signup(email, password, name);
      
      // Success! User is now logged in
      // Navigation to HomeScreen happens automatically in App.js
      Alert.alert('Success', 'Account created successfully! 🎉');
      
    } catch (error) {
      // Handle signup errors
      // WHY: Show helpful error messages to user
      let errorMessage = 'Signup failed. Please try again.';
      
      // Customize error messages based on error type
      if (error.message.includes('user_already_exists')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password does not meet requirements.';
      }
      
      Alert.alert('Signup Error', errorMessage);
      
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    ><Gradient />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account </Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            editable={!localLoading}
          />
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
            placeholder="Create a password (min 8 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            editable={!localLoading}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!localLoading}
          />
        </View>

        {/* Password Requirements Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Password must be at least 8 characters long
          </Text>
        </View>

        {/* Signup Button */}

 <LinearGradient
          colors={["#5AC8FA", "#007AFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >


        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignup}
          disabled={localLoading}


        >


          
          {localLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
</LinearGradient>
        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={localLoading}
          >
            <Text style={styles.linkText}>Login</Text>
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
    marginBottom: 30,
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
    marginBottom: 16,
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
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 50,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    color: '#1976d2',
    fontSize: 13,
  },
  button: {
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    // marginBottom: 20,
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
// 1. Provides signup form with name, email, password, confirm password
// 2. Validates all inputs (email format, password strength, match)
// 3. Calls signup() from AuthContext
// 4. Shows loading state during signup
// 5. Displays helpful error messages
// 6. Auto-logs in user after successful signup
// 7. Shows password requirements to user
// 8. Navigates back to Login screen if user already has account