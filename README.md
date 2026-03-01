# Sehar

Sehar is a React Native mindfulness companion that lets you have real-time voice conversations with an AI — picking up where guided meditation apps stop, by actually talking back to you.

---

## What the App Does

You open the app, choose a session — Sehar Awakening, Grounded Presence, Heart's Ease, Quiet Reflection, or Night's Rest — tap Start, and speak. A conversational AI responds in natural voice, adapting its tone to the session context and even knowing your name. When you're done, the session is transcribed, summarised, and saved to your history. The whole interaction feels less like an app and more like a conversation with a calm, attentive guide.

---

## Architecture

### The Voice Layer: ElevenLabs Conversational AI

The heart of Sehar is ElevenLabs' Conversational AI SDK (`@elevenlabs/react-native`). When a session starts, `SessionScreen` calls `conversation.startSession()` with your ElevenLabs Agent ID and a set of dynamic variables — `user_name`, `session_title`, and `session_description` — that shape how the agent speaks to you. The agent handles turn detection, interruption, and voice synthesis on ElevenLabs' infrastructure; the app receives events (`onConnect`, `onMessage`, `onModeChange`, `onStatusChange`) and responds to them without managing any audio streaming logic directly.

One custom tool is exposed back to the agent: `handleSetBrightness`. This lets the AI dim the screen during a wind-down session by calling into `expo-brightness` — an example of the two-way tool-calling bridge ElevenLabs supports.

ElevenLabs was chosen over building a custom STT → LLM → TTS pipeline for one reason: it handles the entire conversation loop as a single real-time connection. Rolling your own pipeline means dealing with three separate network hops (speech-to-text, inference, text-to-speech), each adding 200–600 ms of latency. ElevenLabs compresses that into a single persistent WebSocket session managed on their edge, reducing perceived response time to sub-second in most conditions.

### Why LiveKit Is in the Stack

`@livekit/react-native` and `@livekit/react-native-webrtc` appear as dependencies because ElevenLabs' React Native SDK uses LiveKit as its underlying WebRTC transport. You don't interact with LiveKit directly — it lives entirely beneath the ElevenLabs SDK, providing the low-latency, bidirectional audio channel that makes the conversation feel live rather than transactional. LiveKit's media server handles jitter buffering, packet loss concealment, and adaptive bitrate — none of which you'd want to implement yourself on a mobile client.

### The Latency Problem and How It's Solved

The main challenge with real-time voice AI on mobile is UI latency causing re-renders that interrupt the audio pipeline. The first symptom: every time the connection status changed, `ElevenLabsProvider` would re-mount, dropping the session.

The fix was to memoize the provider and its children so the React tree above the audio session never causes a re-render of the session itself:

```js
// SessionScreen.js
const content = useMemo(() => (
  <ElevenLabsProvider>
    <SessionContent onStatusChange={setIsConnected} />
  </ElevenLabsProvider>
), []);
```

`isConnected` state — which drives the animated gradient — lives in the parent component and is passed down via a stable callback (`useCallback`). The gradient re-renders freely; the voice session does not. All event handlers inside `SessionContent` are also memoized with `useCallback` to prevent the `useConversation` hook from re-initialising on every render.

### The Visual Layer: Skia + Reanimated

The pulsing gradient backdrop is rendered with `@shopify/react-native-skia`, which draws directly to a GPU canvas outside the React Native layout engine. A `RadialGradient` is centered on the screen with animated radius and position values driven by `react-native-reanimated` shared values — keeping the animation entirely on the UI thread, never blocking the JS thread where the voice session runs.

When `isSpeaking` is true, the gradient's base radius shrinks and its center moves to the middle of the screen, then `withRepeat` pulses it continuously. When the session ends, a `withTiming` call returns it to its resting position. The result is a visual breathing effect that responds to the live connection state without a single `setState` call in the animation path.

### Auth and Persistence: Appwrite

User accounts and session history are handled by Appwrite (`react-native-appwrite`). On signup the app creates an account and immediately logs in. Auth state is held in a React context (`AuthProvider`) that checks for an existing session on cold start. Session summaries — transcript, title, duration, token cost, `user_id` — are written to an Appwrite database document after you tap "Save to History" on the Summary screen. The home screen queries that collection filtered by `user_id` to show your conversation history.

After a session ends, `SummaryScreen` fetches the full conversation object from the ElevenLabs REST API (`GET /v1/convai/conversations/:id`) using an `xi-api-key` header. ElevenLabs processes the conversation asynchronously, so the screen polls with a manual refresh button until `status === "done"`, at which point the transcript, AI-generated summary title, and call stats are displayed.

---

## Flow Diagram

```
User picks session
       │
       ▼
SessionScreen
  ElevenLabsProvider (memoized, never re-mounts)
       │
       ├── conversation.startSession(agentId, dynamicVariables)
       │        │
       │        └── LiveKit WebRTC channel (bidirectional audio)
       │                  │
       │                  └── ElevenLabs edge  ──►  LLM + TTS
       │
       ├── isSpeaking → Gradient (Skia + Reanimated, UI thread)
       │
       └── conversation.endSession()
                 │
                 ▼
         SummaryScreen
           GET /v1/convai/conversations/:id  (ElevenLabs REST)
                 │
                 └── saveAndContinue()
                          │
                          └── Appwrite.createDocument()
```

---

## Project Structure

```
src/
├── api/
│   └── ConversationsApi.js      # ElevenLabs REST fetch for conversation summary
├── components/
│   └── Gradient.js              # Skia radial gradient with Reanimated animation
├── config/
│   └── appwrite.js              # Appwrite client, Account, and Databases init
├── context/
│   └── AuthContext.js           # Global auth state (login / signup / logout)
├── hooks/
│   └── useAuth.js               # Convenience hook for AuthContext
├── screens/
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── HomeScreen.js            # Session picker + history from Appwrite
│   ├── SessionScreen.js         # Live voice session via ElevenLabs
│   └── SummaryScreen.js        # Post-session transcript + save
└── utils/
    └── sessions.js              # Static list of 5 mindfulness session types
```

---

## Environment Variables

Create a `.env` file at the project root:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT=your_project_id
APP_PLATFORM=com.yourcompany.sehar
DB_ID=your_database_id
COLLECTION_ID=your_collection_id
EXPO_PUBLIC_AGENT_ID=your_elevenlabs_agent_id
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
EXPO_PUBLIC_ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1/convai/conversations
```

---

## Getting Started

```bash
npm install
npx expo run:ios   # or run:android
```

The app requires a physical device or a simulator with microphone access. The ElevenLabs agent must be configured with the `handleSetBrightness` client tool if you want screen brightness control; otherwise the conversation works without it.
