import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { sessions } from '../utils/sessions';
import Gradient from '../components/Gradient';
import { appwriteConfig } from '../config/appwrite';


import { LinearGradient } from 'expo-linear-gradient';
import { database } from '../config/appwrite';

export default function HomeScreen() {



  useEffect(() => {
    fetchSessions();
  }, []);
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [sessionHistory, setSessionHistory] = useState([]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };


  const fetchSessions = async () => {
    if (!user) {
      alert("No user found!");
      return;
    }

    try {
      const { documents } = await database.listDocuments(
        appwriteConfig
          .db,
        appwriteConfig.collection,
        [Query.equal("user_id", user.id)]
      );

      console.log("Fetched Sessions:", documents);
      // return documents;
      setSessionHistory(documents
      );

    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  };




  // Assuming 'database', 'appwriteConfig', 'ID', 'conversation', 'conversationId', and 'router' 
  // are all defined and available in the scope.






  return (
    <View style={styles.container}>
      <Gradient position="top" />


      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Sessions List */}
      <View style={styles.sessionsContainer}>
        <Text style={styles.sectionTitle}>Available Sessions</Text>
        <Text style={styles.sectionSubtitle}>Choose a session to begin your journey</Text>
        <ScrollView horizontal style={styles.scrollContent} contentInsetAdjustmentBehavior="automatic" showsHorizontalScrollIndicator={false}>
          <View style={styles.grid}>
            {sessions.map((session) => (
              <Pressable
                key={session.id}
                style={styles.card}
                onPress={() => navigation.navigate('Session', { sessionId: session.id })}
              >
                <Image source={session.image} style={styles.cardImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                  style={styles.gradientOverlay}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{session.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {session.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
      <Text style={styles.sectionTitle}>Recents</Text>

    </View>
  );
}


{/* experimental wala issue    -- gradient overlay */ }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  logoutText: {
    color: '#d32f2f',
    fontWeight: '600',
    fontSize: 14,
  },
  sessionsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    flex: 0.8,
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    width: 280,
    height: 300,
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,

  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
  },
});
