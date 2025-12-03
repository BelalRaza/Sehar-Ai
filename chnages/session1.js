import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useConversation, ElevenLabsProvider } from "@elevenlabs/react-native";
import Constants from 'expo-constants';
import { useAuth } from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sessions } from "../utils/sessions";
import Gradient from "../components/Gradient";

const { width } = Dimensions.get('window');

function SessionContent() {
    const { user } = useAuth();
    const route = useRoute();
    const { sessionId } = route.params || {};
    const [conversationID, setConversationID] = useState("");

    const session = sessions.find((session) => session.id === Number(sessionId)) ?? sessions[0];
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to conversation");
        },
        onDisconnect: () => {
            console.log("Disconnected to conversation");
        },
        onMessage: (message) => {
            console.log("Received message:", message);
        },
        onError: (error) => {
            console.error("Conversation error:", error);
        },
        onModeChange: (mode) => {
            console.log("Conversation mode changed:", mode);
        },
        onStatusChange: (prop) => {
            console.log("Conversation status changed:", prop.status);
        },
        onCanSendFeedbackChange: (prop) => {
            console.log("Can send feedback changed:", prop.canSendFeedback);
        },
        onUnhandledClientToolCall: (params) => {
            console.log("Unhandled client tool call:", params);
        },
    });

    const StartConversation = async () => {
        try {
            const agentId = Constants.expoConfig?.extra?.EXPO_PUBLIC_AGENT_ID;
            console.log('Starting conversation with agentId:', agentId);

            await conversation.startSession({
                agentId: agentId,
                dynamicVariables: {
                    user_name: user?.name || "User",
                    session_title: session.title,
                    session_description: session.description
                }
            })
        }
        catch (e) {
            console.error('Error starting conversation:', e)
        }
    }

    const EndConversation = async () => {
        try {
            await conversation.endSession()
        }
        catch (e) {
            console.log(e)
        }
    }

    const isConnected = conversation.status === "connected";
    const isConnecting = conversation.status === "connecting";

    // const isConnecting = conversation.status === "connecting";

    return (
        <>
            <Gradient position="top" isSpeaking={
                isConnected
                // || isConnecting
            } />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>

                        <View style={styles.header}>
                            <Text style={styles.title}>{session.title}</Text>
                            <Text style={styles.description}>{session.description}</Text>
                        </View>



                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={[styles.button, styles.startButton]}
                                onPress={StartConversation}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.startButtonText}>Start Conversation</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.endButton]}
                                onPress={EndConversation}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.endButtonText}>End Conversation</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.debugInfo}>
                            <Text style={styles.debugText}>Session ID: {sessionId}</Text>
                            <Text style={styles.debugText}>Status: {conversation.status}</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '90%',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        marginBottom: 48,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    controls: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    startButton: {
        backgroundColor: '#1F2937', // Dark elegant color
    },
    endButton: {
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#4DA6FF',
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    endButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    debugInfo: {
        marginTop: 40,
        alignItems: 'center',
        opacity: 0.5,
    },
    debugText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#070707ff',
        marginBottom: 4,
    }
});

export default function SessionScreen() {


    return (
        <ElevenLabsProvider >
            <SessionContent />
        </ElevenLabsProvider>
    );
}
