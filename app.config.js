import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      // These will be read at runtime by expo-constants
      APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
      APPWRITE_PROJECT: process.env.APPWRITE_PROJECT,
      APP_PLATFORM: process.env.APP_PLATFORM,
      EXPO_PUBLIC_AGENT_ID: process.env.EXPO_PUBLIC_AGENT_ID,

    },
  };
};
