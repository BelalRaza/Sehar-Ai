// src/screens/HomeScreen.js

// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useAuth } from '../hooks/useAuth';

// // HomeScreen Component
// // WHY: Protected screen only accessible to logged-in users
// export default function HomeScreen() {

//   // Get user and logout function from auth context
//   // WHY: Display user info and provide logout functionality
//   const { user, logout, loading } = useAuth();

//   // Handle logout button press
//   // WHY: Logs out user and navigates back to login screen
//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await logout();
//               // Navigation to LoginScreen happens automatically in App.js
//               // WHY: When user becomes null, App.js re-renders auth screens

//             } catch (error) {
//               Alert.alert('Error', 'Failed to logout. Please try again.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   // Show loading if user data not yet available
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6200ee" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>

//       {/* Welcome Section */}
//       <View style={styles.welcomeSection}>
//         <Text style={styles.welcomeEmoji}>🎉</Text>
//         <Text style={styles.welcomeText}>Welcome!</Text>
//         <Text style={styles.nameText}>{user?.name || 'User'}</Text>
//       </View>

//       {/* User Info Card */}
//       <View style={styles.infoCard}>
//         <Text style={styles.infoLabel}>Email</Text>
//         <Text style={styles.infoValue}>{user?.email}</Text>

//         <View style={styles.divider} />

//         <Text style={styles.infoLabel}>User ID</Text>
//         <Text style={styles.infoValue}>{user?.$id}</Text>

//         <View style={styles.divider} />

//         <Text style={styles.infoLabel}>Account Status</Text>
//         <View style={styles.statusContainer}>
//           <View style={[
//             styles.statusDot, 
//             user?.emailVerification ? styles.verifiedDot : styles.unverifiedDot
//           ]} />
//           <Text style={styles.infoValue}>
//             {user?.emailVerification ? 'Verified ✓' : 'Unverified'}
//           </Text>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity 
//           style={styles.logoutButton}
//           onPress={handleLogout}
//         >
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer Info */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           You're successfully logged in! 🚀
//         </Text>
//       </View>

//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   welcomeSection: {
//     alignItems: 'center',
//     marginVertical: 40,
//   },
//   welcomeEmoji: {
//     fontSize: 60,
//     marginBottom: 10,
//   },
//   welcomeText: {
//     fontSize: 24,
//     color: '#666',
//     marginBottom: 8,
//   },
//   nameText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   infoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '600',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 16,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 12,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   verifiedDot: {
//     backgroundColor: '#4caf50',
//   },
//   unverifiedDot: {
//     backgroundColor: '#ff9800',
//   },
//   actionsContainer: {
//     marginTop: 'auto',
//   },
//   logoutButton: {
//     backgroundColor: '#d32f2f',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   footer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   footerText: {
//     color: '#999',
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });

// // WHAT THIS FILE DOES:
// // 1. Displays user information (name, email, ID)
// // 2. Shows email verification status
// // 3. Provides logout button with confirmation dialog
// // 4. Demonstrates accessing user data from AuthContext
// // 5. Only accessible when user is logged in (protected by App.js)
// // 6. Auto-navigates to login when user logs out




// -----------------

// import { SignOutButton } from "@/components/clerk/SignOutButton";

import { Text, View } from "react-native";
import SessionScreen from "./SessionScreen";
import Gradient from "../components/Gradient"

export default function HomeScreen() {
  return (

    <>
      <Gradient isSpeaking={true} position="top" />
      <SessionScreen />
    </>
  );
}