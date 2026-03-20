import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    AsyncStorage.getItem("dialglobal_auth").then(v => {
      if (v === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    });
  }, []);
  return null;
}
