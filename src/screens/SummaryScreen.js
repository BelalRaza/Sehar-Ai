import Gradient from "../components/Gradient";
import { getConversationSummary } from "../api/ConversationsApi";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { appwriteConfig } from "../config/appwrite";
// import { database } from "../config/appwrite";
// import { ID } from "appwrite";


export default function SummaryScreen() {
    const route = useRoute();
    const navigation = useNavigation();
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




// async function saveAndContinue() {
//     try {
//         // 1. Create the document in Appwrite
//         await database.createDocument(
//             appwriteConfig.db,
//             appwriteConfig.collection,
//             ID.unique(), // Generates a unique ID for the new document
//             {
//                 // Data to be saved to the database:
//                 status: conversation?.status,
//                 conv_id: conversationId,
//                 tokens: Number(conversation?.metadata?.cost),
//                 call_duration_secs: Number(conversation?.metadata?.call_duration_secs),
                
//                 // Joins the transcript messages into a single string
//                 transcript: conversation?.transcript.map((t) => t.message).join("\n"),
                
//                 call_summary_title: conversation?.analysis?.call_summary_title,
                
//                 // Add any other required fields here...
//             }
//         );
        
//         // 2. Dismiss the modal/screens after successful save
//         // router.dismissAll(); 
//         navigation.navigate("Home")
        
//     } catch (error) { // Corrected the catch syntax
//         console.log("Error saving conversation:", error);
//     }
// }







    return (
        <>
            <Gradient position="bottom" isSpeaking={false} />
            <SafeAreaView>

                <ScrollView>

                    {/* Display status/loading message if conversation is NOT "done" */}
                    {isProcessing && (
                        <View style={{ gap: 16, paddingBottom: 16 }}>
                            <Text style={styles.title}>We are processing your call...</Text>
                            <Text style={styles.subtitle}>This may take a few minutes.</Text>
                            <Text style={styles.subtitle}>
                                Current status: {conversation?.status}
                            </Text>
                            {/* Button to manually check the status again */}
                            <Button onPress={getSummary} title={isLoading ? "Refreshing..." : "Refresh"} disabled={isLoading} />
                        </View>
                    )}

                    {/* Display summary details if conversation status IS "done" */}
                    {conversation?.status === "done" && conversation.analysis && conversation.metadata && (
                        <View style={{ gap: 16, paddingBottom: 16 }}>
                            {/* <Text style={styles.caption}>{conversationId}</Text> */}

                            <Text style={styles.title}>
                                {conversation.analysis.call_summary_title}
                            </Text>

                            <Text style={styles.subtitle}>
                                {conversation.analysis.transcript_summary.trim()}
                            </Text>

                            {/* Stats Section */}
                            <Text style={styles.title}>Stats</Text>
                            <Text style={styles.subtitle}>
                                {conversation.metadata.call_duration_secs} seconds
                            </Text>
                            <Text style={styles.subtitle}>
                                {conversation.metadata.cost} tokens
                            </Text>
                            <Text style={styles.subtitle}>
                                {new Date(
                                    // Note: Removed '!' (non-null assertion) for JS cleanliness.
                                    conversation.metadata.start_time_unix_secs * 1000
                                ).toLocaleString()}
                            </Text>

                            {/* Transcript Section */}
                            <Text style={styles.title}>Transcript</Text>
                            <Text style={styles.subtitle}>
                                {/* Map and join the messages from the transcript array */}
                                {conversation.transcript.map((t) => t.message).join("\n")}
                            </Text>
                        </View>
                    )}

                    <View style={{ alignItems: "center" }}>
                        <Button
                            // Corrected the arrow function syntax and the router function name
                            // onPress={saveAndContinue}
                            title="Save and continue"
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// --- StyleSheet Definition ---
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
    },
    caption: {
        fontSize: 12,
        color: "gray",
    },
});












