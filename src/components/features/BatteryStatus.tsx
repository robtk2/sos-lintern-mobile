import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@theme';
import { useSOSStore } from '@store/useSOSStore';

import { Typography } from "@components/ui/Typography";

/**
 * Visual indicator of battery level and safety status.
 */
export const BatteryStatus: React.FC = () => {
  const theme = useTheme();
  const { 
    batteryLevel, 
    isLowBattery, 
    batteryThreshold, 
    sosActive, 
    burnRate 
  } = useSOSStore();

  const percentage = Math.round(batteryLevel * 100);

  // Heuristic estimation logic
  const getEstimatedMinutes = () => {
    const defaultMsPerPercent = sosActive ? 120000 : 900000;
    const effectiveRate = burnRate || defaultMsPerPercent;
    
    const msLeft = (batteryLevel * 100) * effectiveRate;
    return Math.floor(msLeft / 60000);
  };

  const estimatedMinutes = getEstimatedMinutes();
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: `${batteryLevel * 100}%`,
      backgroundColor: batteryLevel > batteryThreshold 
        ? '#34C759' 
        : theme.colors.error,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name={isLowBattery ? "battery-dead" : "battery-charging"} 
          size={16} 
          color={isLowBattery ? theme.colors.error : theme.colors.textSecondary} 
        />
        <Typography 
          variant="h2" 
          color={isLowBattery ? theme.colors.error : theme.colors.textSecondary}
          style={styles.label}
        >
          {isLowBattery ? 'LOW BATTERY - AUTO STOP ENABLED' : 'BATTERY LEVEL'}
        </Typography>
        <Typography variant="body">
          {percentage}%
        </Typography>
      </View>
      
      <View style={[styles.barContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
      </View>
      
      <View style={styles.footer}>
        <Typography variant="h2">
          Est. {hours > 0 ? `${hours}h ` : ''}{minutes}m remaining {burnRate ? '• Calibrated' : ''}
        </Typography>
        <Typography variant="h2">
          Safety: {Math.round(batteryThreshold * 100)}%
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 6,
    marginTop: 0,
    flex: 1,
  },
  barContainer: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
