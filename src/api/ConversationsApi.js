export async function getConversationSummary(conversationId) {
    if (!conversationId) {
        console.error("Conversation ID is required");
        return null;
    }

    const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    const baseUrl = process.env.EXPO_PUBLIC_ELEVENLABS_BASE_URL;

    if (!apiKey || !baseUrl) {
        console.error("Required environment variables are not set");
        return null;
    }

    const url = `${baseUrl}/${conversationId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch summary:", response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching conversation summary:", error);
        return null;
    }
}