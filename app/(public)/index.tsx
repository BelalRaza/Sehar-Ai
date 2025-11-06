import SignIn from "@/components/clerk/SignIn";
import { Text, View } from "react-native";

export default function Index() {
  return ( <SignIn signUpUrl="/sign-up" scheme="sehar" homeUrl="(private)" />)
}
