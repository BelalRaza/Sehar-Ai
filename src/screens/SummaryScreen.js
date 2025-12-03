import Gradient from "../components/Gradient";
import { getConversationSummary } from "../api/ConversationsApi";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appwriteConfig, ID } from "../config/appwrite";
import { database } from "../config/appwrite";
import { useAuth } from "../hooks/useAuth";



export default function SummaryScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAuth();
    const { conversationId } = route.params || {};
    const [conversation, setConversation] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    async function getSummary() {
        setIsLoading(true);
        const data = await getConversationSummary(conversationId);
        setIsLoading(false);
        if (data) {
            console.log("Conversation Data:", data);
            setConversation(data);
        }
    }

    useEffect(() => {
        getSummary();
    }, [])





    const isProcessing = conversation?.status !== "done";




    async function saveAndContinue() {
        try {
            // 1. Create the document in Appwrite
            await database.createDocument(
                appwriteConfig.db,
                appwriteConfig.collection,
                ID.unique(), // Generates a unique ID for the new document
                {
                    // Data to be saved to the database:
                    status: conversation?.status,
                    conv_id: conversationId,
                    tokens: Math.min(Math.max(Number(conversation?.metadata?.cost) || 0, 1), 600),
                    call_duration_secs: Number(conversation?.metadata?.call_duration_secs),

                    // Joins the transcript messages into a single string
                    transcript: conversation?.transcript.map((t) => t.message).join("\n"),

                    call_summary_title: conversation?.analysis?.call_summary_title,
                    user_id: user?.$id,

                    // Add any other required fields here...
                }
            );

            // 2. Dismiss the modal/screens after successful save
            // router.dismissAll(); 
            navigation.navigate("Home")

        } catch (error) { // Corrected the catch syntax
            console.log("Error saving conversation:", error);
        }
    }







    return (
        <>
            <Gradient position="bottom" isSpeaking={false} />
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Session Summary</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Processing State */}
                    {isProcessing && (
                        <View style={styles.card}>
                            <ActivityIndicator size="large" color="#4a90e2" style={{ marginBottom: 20 }} />
                            <Text style={styles.processingTitle}>Processing your session...</Text>
                            <Text style={styles.processingSubtitle}>This usually takes a few moments.</Text>
                            <Text style={styles.statusText}>Status: {conversation?.status}</Text>

                            <TouchableOpacity
                                onPress={getSummary}
                                style={[styles.button, styles.outlineButton, { marginTop: 20 }]}
                                disabled={isLoading}
                            >
                                <Text style={styles.outlineButtonText}>{isLoading ? "Refreshing..." : "Refresh Status"}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Done State */}
                    {conversation?.status === "done" && conversation.analysis && conversation.metadata && (
                        <>
                            {/* Main Summary Card */}
                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>
                                    {conversation.analysis.call_summary_title}
                                </Text>
                                <Text style={styles.summaryText}>
                                    {conversation.analysis.transcript_summary.trim()}
                                </Text>
                            </View>

                            {/* Stats Card */}
                            <View style={styles.card}>
                                <Text style={styles.cardHeader}>Session Stats</Text>
                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="time-outline" size={24} color="#4a90e2" />
                                        <Text style={styles.statValue}>{conversation.metadata.call_duration_secs}s</Text>
                                        <Text style={styles.statLabel}>Duration</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Ionicons name="wallet-outline" size={24} color="#4a90e2" />
                                        <Text style={styles.statValue}>{conversation.metadata.cost}</Text>
                                        <Text style={styles.statLabel}>Tokens</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Ionicons name="calendar-outline" size={24} color="#4a90e2" />
                                        <Text style={styles.statValue}>
                                            {new Date(conversation.metadata.start_time_unix_secs * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Text style={styles.statLabel}>Date</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Transcript Card */}
                            <View style={styles.card}>
                                <Text style={styles.cardHeader}>Transcript</Text>
                                <View style={styles.transcriptBox}>
                                    <Text style={styles.transcriptText}>
                                        {conversation.transcript.map((t) => t.message).join("\n\n")}
                                    </Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionContainer}>
                                <TouchableOpacity onPress={saveAndContinue} style={styles.primaryButton}>
                                    <Text style={styles.primaryButtonText}>Save to History</Text>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>

                            </View>
                        </>
                    )}

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={[styles.outlineButton, { borderColor: '#666' }]}>
                            <Text style={[styles.outlineButtonText, { color: '#666' }]}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// --- StyleSheet Definition ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    processingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    processingSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    transcriptBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        maxHeight: 200,
    },
    transcriptText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    actionContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#4a90e2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#4a90e2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#4a90e2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#4a90e2',
        fontSize: 16,
        fontWeight: '600',
    },
});












