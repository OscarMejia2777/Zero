import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Profile</Text>

      <Pressable
        onPress={() => router.replace("/auth/login")}
        style={{
          backgroundColor: "#111827",
          padding: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Log out (MVP)</Text>
      </Pressable>
    </View>
  );
}
