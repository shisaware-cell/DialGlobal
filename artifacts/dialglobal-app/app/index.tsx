import { useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function Index() {
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/onboarding");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", session.user.id)
        .single();

      if (!profile?.plan) {
        router.replace("/paywall");
      } else {
        router.replace("/(tabs)");
      }
    });
  }, []);
  return null;
}
