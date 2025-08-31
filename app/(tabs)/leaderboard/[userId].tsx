import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function userProfilePage() {
  const params = useLocalSearchParams();
  console.log(params);
  return (
    <View>
      <Text>All your little sidemens</Text>
    </View>
  );
}
