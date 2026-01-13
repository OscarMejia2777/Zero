import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false;
  const onboardingCompleted = false;

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/notifications" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
