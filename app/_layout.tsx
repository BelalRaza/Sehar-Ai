//entry point for my app
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";


function RootLayoutwithAuth() {
  const {isSignedIn,isLoaded} = useAuth();


if(!isLoaded){
  return null;
}  

  return (
  <Stack>
    <Stack.Protected guard={isSignedIn}>
      <Stack.Screen name="(private)"/>  
    </Stack.Protected>


<Stack.Protected guard={!isSignedIn}>
      <Stack.Screen name="(public)" options={{headerShown:false}}/>
</Stack.Protected>
    
  </Stack>
  )
}

export default function RootLayout() {
  return ( 
  <ClerkProvider
  tokenCache={tokenCache}
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
>
  <RootLayoutwithAuth />
  

  </ClerkProvider>
  )
}
