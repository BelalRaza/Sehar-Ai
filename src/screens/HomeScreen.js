

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { sessions } from '../utils/sessions';
import Gradient from '../components/Gradient';
import { appwriteConfig } from '../config/appwrite';


import { LinearGradient } from 'expo-linear-gradient';
import { database } from '../config/appwrite';
import { Query } from 'react-native-appwrite';
import { Ionicons } from '@expo/vector-icons';

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
        appwriteConfig.db,
        appwriteConfig.collection,
        [Query.equal("user_id", user.$id)]
      );

      console.log("Fetched Sessions:", documents);
      // return documents;
      setSessionHistory(documents);
      console.log("Session History:", sessionHistory);
      console.log("8989898------432----------------42342", documents)


    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await database.deleteDocument(
        appwriteConfig.db,
        appwriteConfig.collection,
        sessionId
      );
      setSessionHistory((prev) => prev.filter((session) => session.$id !== sessionId));
      Alert.alert("Success", "Session deleted successfully");
    } catch (error) {
      console.log("Error deleting session:", error);
      Alert.alert("Error", "Failed to delete session");
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

      <View style={{ flex:0.75}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
          <Text style={styles.recentsTitle}>Recents</Text>
          <TouchableOpacity onPress={fetchSessions} style={{ marginLeft: 10 }}>
            <Ionicons name="refresh-circle-sharp" size={32} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {sessionHistory.length > 0 ? (
            sessionHistory.map((session) => (
              <SessionCard
                key={session.$id}
                session={session}
                onDelete={deleteSession}
              />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#666" }}>No sessions found</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Account Card */}
      <AccountCard user={user} onLogout={handleLogout} />
    </View>
  );
}

const AccountCard = ({ user, onLogout }) => (
  <View style={styles.accountCard}>
    <View style={{ flex: 1, marginRight: 10 }}>
      <Text style={styles.accountName}>{user?.name || 'User'}</Text>
      <Text style={styles.accountEmail} numberOfLines={1}>{user?.email || 'No email'}</Text>
    </View>
    <TouchableOpacity onPress={onLogout} style={styles.signOutButton}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  </View>
);

const SessionCard = ({ session, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const randomEmoji = useMemo(() => {
    const emojis = ["✨", "💡", "🧠", "🌱", "🧘", "📚", "🎙️", "💬", "💭", "🌟"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  const primaryColor = "#4a90e2"; // Define a primary color

  const handleDelete = () => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(session.$id) }
      ]
    );
  };

  return (
    <View
      style={{
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: "white",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>{randomEmoji}</Text>
        <TouchableOpacity onPress={handleDelete} style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
        {session.call_summary_title || "Session Summary"}
      </Text>

      {isExpanded ? (
        <>
          <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
            {session.transcript}
          </Text>
          <Pressable onPress={() => setIsExpanded(false)}>
            <Text style={{ fontSize: 14, color: primaryColor, fontWeight: "600" }}>
              Read less
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setIsExpanded(true)}>
          <Text style={{ fontSize: 14, color: primaryColor, fontWeight: "600" }}>
            Read more
          </Text>
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ fontSize: 12, color: "#888" }}>
          {session.call_duration_secs}s • {session.tokens} tokens
        </Text>
        <Text style={{ fontSize: 12, color: "#888" }}>
          {new Date(session.$createdAt).toLocaleDateString("en-IN")}
        </Text>
      </View>
    </View>
  );
};






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
    // height:150
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recentsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
    height:250  

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
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  accountName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#795548', // Brown color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  signOutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});













// import React, { useEffect, useState } from 'react';


// import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '../hooks/useAuth';
// import { sessions } from '../utils/sessions';
// import Gradient from '../components/Gradient';
// import { appwriteConfig } from '../config/appwrite';


// import { LinearGradient } from 'expo-linear-gradient';
// import { database } from '../config/appwrite';

// export default function HomeScreen() {



//   useEffect(() => {
//     fetchSessions();
//   }, []);
//   const navigation = useNavigation();
//   const { user, logout } = useAuth();
//   const [sessionHistory, setSessionHistory] = useState([]);

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to logout?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Logout', style: 'destructive', onPress: logout },
//     ]);
//   };


//   const fetchSessions = async () => {
//     if (!user) {
//       alert("No user found!");
//       return;
//     }

//     try {
//       const { documents } = await database.listDocuments(
//         appwriteConfig
//           .db,
//         appwriteConfig.collection,
//         [Query.equal("user_id", user.id)]
//       );

//       console.log("Fetched Sessions:", documents);
//       // return documents;
//       setSessionHistory(documents
//       );

//     } catch (error) {
//       console.log("Error fetching sessions:", error);
//     }
//   };




//   // Assuming 'database', 'appwriteConfig', 'ID', 'conversation', 'conversationId', and 'router' 
//   // are all defined and available in the scope.






//   return (
//     <View style={styles.container}>
//       <Gradient position="top" />


//       {/* Header Section */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greeting}>Welcome back,</Text>
//           <Text style={styles.username}>{user?.name || 'User'}</Text>
//         </View>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Sessions List */}
//       <View style={styles.sessionsContainer}>
//         <Text style={styles.sectionTitle}>Available Sessions</Text>
//         <Text style={styles.sectionSubtitle}>Choose a session to begin your journey</Text>
//         <ScrollView horizontal style={styles.scrollContent} contentInsetAdjustmentBehavior="automatic" showsHorizontalScrollIndicator={false}>
//           <View style={styles.grid}>
//             {sessions.map((session) => (
//               <Pressable
//                 key={session.id}
//                 style={styles.card}
//                 onPress={() => navigation.navigate('Session', { sessionId: session.id })}
//               >
//                 <Image source={session.image} style={styles.cardImage} />
//                 <LinearGradient
//                   colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
//                   style={styles.gradientOverlay}
//                 />
//                 <View style={styles.cardContent}>
//                   <Text style={styles.cardTitle}>{session.title}</Text>
//                   <Text style={styles.cardDescription} numberOfLines={2}>
//                     {session.description}
//                   </Text>
//                 </View>
//               </Pressable>
//             ))}
//           </View>
//         </ScrollView>
//       </View>
//       <Text style={styles.sectionTitle}>Recents</Text>

//     </View>
//   );
// }


// {/* experimental wala issue    -- gradient overlay */ }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   greeting: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#666',
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   logoutButton: {
//     padding: 8,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     borderRadius: 20,
//   },
//   logoutText: {
//     color: '#d32f2f',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   sessionsContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   sectionTitle: {
//     flex: 0.8,
//     marginHorizontal: 20,
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//   },
//   grid: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   card: {
//     width: 280,
//     height: 300,
//     backgroundColor: '#ffffffff',
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//     marginBottom: 16,

//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '60%',
//   },
//   cardContent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     zIndex: 1,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#E0E0E0',
//     lineHeight: 20,
//   },
// });
