import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import C from "@/constants/colors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "number.square", selected: "number.square.fill" }} />
        <Label>Numbers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="inbox">
        <Icon sf={{ default: "message", selected: "message.fill" }} />
        <Label>Inbox</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calls">
        <Icon sf={{ default: "phone", selected: "phone.fill" }} />
        <Label>Calls</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>More</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function AnimatedFab() {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.00, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.6, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Animated.View style={[
        tb.fabGlow,
        { opacity: glow },
      ]} />
      <View style={tb.fab}>
        <Feather name="plus" size={26} color="#fff" />
      </View>
    </Animated.View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isWeb  = Platform.OS === "web";
  const isIOS  = Platform.OS === "ios";
  const barH   = isWeb ? 84 : 66;
  const pb     = insets.bottom > 0 ? insets.bottom : 8;

  const FAB_INSERT_BEFORE = 2;

  const items = state.routes.map((route, index) => {
    const isFocused = state.index === index;
    const { options } = descriptors[route.key];

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, undefined as any);
      }
    };

    return { route, index, isFocused, options, onPress };
  });

  return (
    <View style={[tb.bar, { height: barH + pb, paddingBottom: pb }]}>
      {isIOS ? (
        <BlurView
          intensity={80}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderTopWidth: 0.5, borderTopColor: C.border }]}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: C.surface, borderTopWidth: 0.5, borderTopColor: C.border }]} />
      )}

      {items.map(({ route, index, isFocused, options, onPress }) => (
        <React.Fragment key={route.key}>
          {index === FAB_INSERT_BEFORE && (
            <Pressable
              style={tb.fabWrap}
              onPress={() => router.push("/picker")}
              hitSlop={10}
            >
              <AnimatedFab />
            </Pressable>
          )}

          <Pressable style={tb.tabItem} onPress={onPress} hitSlop={6}>
            <View style={[tb.iconWrap, isFocused && tb.iconWrapActive]}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? C.accent : C.textMuted,
                size: 22,
              })}
            </View>
            <Text style={[tb.label, { color: isFocused ? C.accent : C.textMuted }]}>
              {options.title}
            </Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

function ClassicTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Numbers",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios"
              ? <SymbolView name="number.square" tintColor={color} size={22} />
              : <Feather name="hash" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios"
              ? <SymbolView name="message" tintColor={color} size={22} />
              : <Feather name="message-circle" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios"
              ? <SymbolView name="phone" tintColor={color} size={22} />
              : <Feather name="phone" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "More",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios"
              ? <SymbolView name="gearshape" tintColor={color} size={22} />
              : <Feather name="grid" size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}

const tb = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 6,
  },
  iconWrap: {
    width: 36,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: C.accentDim,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 9.5,
  },

  fabWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    paddingBottom: 6,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },
  fabGlow: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 24,
    backgroundColor: C.accent,
    zIndex: -1,
  },
});
