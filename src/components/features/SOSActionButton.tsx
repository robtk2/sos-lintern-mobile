import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useTheme } from "@theme";

interface SOSActionButtonProps {
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Main command button for the SOS signal.
 * Features a high-contrast premium design with glowing animations.
 */
export const SOSActionButton: React.FC<SOSActionButtonProps> = ({
  active,
  onPress,
  disabled,
}) => {
  const theme = useTheme();

  // Pulse animation for the outer glow when active
  const pulse = useDerivedValue(() => {
    return active
      ? withRepeat(
          withSequence(
            withTiming(1.2, { duration: 1000 }),
            withTiming(1, { duration: 1000 }),
          ),
          -1,
        )
      : withSpring(1);
  });

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: active ? (pulse.value - 1) * 2 + 0.3 : 0,
    backgroundColor: theme.colors.error,
  }));

  const animatedContainer = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(active ? 0.95 : 1) }],
    borderColor: active ? theme.colors.error : "rgba(255, 255, 255, 0.1)",
  }));

  return (
    <View style={styles.wrapper}>
      {/* Outer Glow */}
      <Animated.View style={[styles.glow, animatedGlow]} />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
      >
        <Animated.View style={[styles.container, animatedContainer]}>
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Text
            style={[
              styles.text,
              { color: active ? theme.colors.error : theme.colors.text },
            ]}
          >
            {active ? "STOP SOS" : "START SOS"}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  glow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  container: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  text: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
