
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useConversation, ElevenLabsProvider } from "@elevenlabs/react-native";
import Constants from 'expo-constants';
import { useAuth } from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sessions } from "../utils/sessions";
import Gradient from "../components/Gradient";
import * as Brightness from 'expo-brightness';
import { useNavigation } from "@react-navigation/native";
// import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

// Extract static UI parts or memoize them to prevent re-renders
const SessionHeader = React.memo(({ title, description }) => (
    <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
    </View>
));

const SessionControls = React.memo(({ onStart, onEnd, isConnected }) => (
    <View style={styles.controls}>
        <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={onStart}
            activeOpacity={0.8}
        >
            <Text style={styles.startButtonText}>Start Conversation</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={onEnd}
            activeOpacity={0.8}
        >
            <Text style={styles.endButtonText}>End Conversation</Text>
        </TouchableOpacity>
    </View>
));

const DebugInfo = React.memo(({ sessionId, status }) => (
    <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Session ID: {sessionId}</Text>
        <Text style={styles.debugText}>Status: {status}</Text>
    </View>
));

function SessionContent({ onStatusChange }) {
    const { user } = useAuth();
    const route = useRoute();
    const navigation = useNavigation();
    const { sessionId } = route.params || {};
    const [conversationId, setConversationId] = useState(null);

    // Memoize session lookup
    const session = useMemo(() =>
        sessions.find((session) => session.id === Number(sessionId)) ?? sessions[0],
        [sessionId]
    );

    // Memoize callbacks for useConversation to prevent recreation on every render
    const onConnect = useCallback(({ conversationId }) => {
        console.log("Connected to conversation:", conversationId);
        setConversationId(conversationId);
    }, []);
    const onDisconnect = useCallback(() => console.log("Disconnected to conversation"), []);
    const onMessage = useCallback((message) => console.log("Received message:", message), []);
    const onError = useCallback((error) => console.error("Conversation error:", error), []);
    const onModeChange = useCallback((mode) => console.log("Conversation mode changed:", mode), []);
    const onStatusChangeCallback = useCallback((prop) => console.log("Conversation status changed:", prop.status), []);
    const onCanSendFeedbackChange = useCallback((prop) => console.log("Can send feedback changed:", prop.canSendFeedback), []);
    const onUnhandledClientToolCall = useCallback((params) => console.log("Unhandled client tool call:", params), []);
    const clientTools = {

        handleSetBrightness: async (parameters) => {
            // Destructure the expected parameter
            const { brightnessValue } = parameters;

            console.log("* Setting brightness to: ", { brightnessValue });

            // Assuming 'Brightness' is imported and available
            const { status } = await Brightness.requestPermissionsAsync();

            if (status === "granted") {
                await Brightness.setSystemBrightnessAsync(brightnessValue);
                return brightnessValue;
            }

            // Handle the case where permission is not granted
            return null;
        }
    }

//
    const conversation = useConversation({
        onConnect,
        onDisconnect,
        onMessage,
        onError,
        onModeChange,
        onStatusChange: onStatusChangeCallback,
        onCanSendFeedbackChange,
        onUnhandledClientToolCall,
        clientTools,
    });

    const isConnected = conversation.status === "connected";

    // Sync status with parent
    useEffect(() => {
        onStatusChange(isConnected);
    }, [isConnected, onStatusChange]);





    const StartConversation = useCallback(async () => {
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
    }, [conversation, user?.name, session.title, session.description]);

    const EndConversation = useCallback(async () => {
        try {
            await conversation.endSession()
            navigation.navigate("Summary", {
                conversationId: conversationId
            });
        }
        catch (e) {
            console.log(e)
        }
    }, [conversation]);

    return ( 
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <SessionHeader title={session.title} description={session.description} />

                    <SessionControls
                        onStart={StartConversation}
                        onEnd={EndConversation}
                        isConnected={isConnected}
                    />

                    <DebugInfo sessionId={sessionId} status={conversation.status} />
                </View>
            </ScrollView>
        </SafeAreaView>
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
    const [isConnected, setIsConnected] = useState(false);

    // Memoize the provider content to prevent it from re-rendering when isConnected changes
    // This is crucial: The ElevenLabsProvider should NOT re-render just because the gradient updates
    const content = useMemo(() => (
        <ElevenLabsProvider>
            <SessionContent onStatusChange={setIsConnected} />
        </ElevenLabsProvider>
    ), []);

    return (
        <>
            <Gradient position="top" isSpeaking={isConnected} />
            {content}
        </>
    );
}
