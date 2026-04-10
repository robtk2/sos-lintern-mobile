import React, { useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  SharedValue,
} from "react-native-reanimated";
import { useTheme } from "@theme";

const ITEM_HEIGHT = 25;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const WHEEL_WIDTH = 65;
const PICKER_WIDTH = WHEEL_WIDTH * 3;

interface WheelItemProps {
  item: string;
  index: number;
  scrollY: SharedValue<number>;
}

/**
 * Atomic component for each number in the wheel.
 * Encapsulates its own animation logic to comply with Hook rules.
 */
const WheelItem: React.FC<WheelItemProps> = ({ item, index, scrollY }) => {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const position = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - position);

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.4, 0.1],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1.1, 0.9, 0.8],
      Extrapolation.CLAMP,
    );

    const rotateX = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [0, 45, 90],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }, { rotateX: `${rotateX}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Text style={[styles.itemText, { color: theme.colors.text }]}>
        {item}
      </Text>
    </Animated.View>
  );
};

interface WheelProps {
  items: string[];
  onIndexChange: (index: number) => void;
  label?: string;
  testID?: string;
}

/**
 * A single wheel for the TimePicker (Hours, Minutes, or Seconds).
 * Uses Reanimated for high-performance scrolling and snapping.
 */
const Wheel: React.FC<WheelProps> = ({ items, onIndexChange, label, testID }) => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.wheelWrapper} testID={testID}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2, // Centering logic
        }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          onIndexChange(index);
        }}
      >
        {items.map((item, index) => (
          <WheelItem
            key={`${item}-${index}`}
            item={item}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

interface TimeWheelPickerProps {
  onTimeChange: (h: number, m: number, s: number) => void;
}

/**
 * High-fidelity time selector with custom 3D wheels.
 * Orchestrates multiple wheels for a unified duration selection.
 */
export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  onTimeChange,
}) => {
  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    [],
  );
  const minsSecs = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
    [],
  );

  const selectedTime = useRef({ h: 0, m: 0, s: 0 });

  const handleChange = (type: "h" | "m" | "s", val: number) => {
    selectedTime.current[type] = val;
    onTimeChange(
      selectedTime.current.h,
      selectedTime.current.m,
      selectedTime.current.s,
    );
  };

  return (
    <View style={styles.container}>
      <Wheel
        items={hours}
        label="H"
        onIndexChange={(i) => handleChange("h", i)}
        testID="wheel-h"
      />
      <Wheel
        items={minsSecs}
        label="M"
        onIndexChange={(i) => handleChange("m", i)}
        testID="wheel-m"
      />
      <Wheel
        items={minsSecs}
        label="S"
        onIndexChange={(i) => handleChange("s", i)}
        testID="wheel-s"
      />

      {/* High-precision selection indicator overlay */}
      <View
        pointerEvents="none"
        style={styles.indicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: PICKER_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  wheelWrapper: {
    width: WHEEL_WIDTH,
    height: CONTAINER_HEIGHT,
    alignItems: "center",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 26,
    fontWeight: "700",
    marginRight: 10,
  },
  indicator: {
    position: "absolute",
    height: ITEM_HEIGHT,
    width: PICKER_WIDTH,
    borderRadius: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  label: {
    position: "absolute",
    right: 12,
    top: CONTAINER_HEIGHT / 2 - 10,
    fontSize: 14,
    fontWeight: "900",
    opacity: 0.6,
  },
});
