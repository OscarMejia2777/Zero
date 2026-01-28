import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false;
  const onboardingCompleted = false;

  // Always start with splash screen
  return <Redirect href="/(auth)/splash" />;
}
