import React from "react";
import { Alert, Text, View } from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { Button } from "react-native";
import { useAuth } from "../hooks/useAuth";


export default function SessionScreen() {
    const { user } = useAuth();
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
            await conversation.startSession({
                agentId: process.env.EXPO_PUBLIC_AGENT_ID,
                dynamicVariables: {
                    user_name: user?.name || "User",
                    session_title: "test",
                    session_description: "test"
                }
            })
        }
        catch (e) {
            console.log(e)
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


    return (

        <View>
            <Text>Session Screen</Text>
            {/* You can display conversation status here if needed */}
            <Text>Status: {conversation.status}</Text>
            <Button title="Send Message" onPress={StartConversation} />
            <Button title="End Conversation" onPress={EndConversation} />
        </View>
    );
}