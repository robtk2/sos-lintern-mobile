import 'react-native-gesture-handler/jestSetup';

// Mock de Expo Modules
jest.mock("expo-modules-core", () => ({
  NativeModulesProxy: {},
  requireNativeModule: jest.fn(() => ({})),
  requireNativeViewManager: jest.fn(() => ({})),
  ProxyNativeModule: {},
  EventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock de Expo Blur
jest.mock("expo-blur", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    BlurView: (props) => React.createElement(View, props),
  };
});

// Mock de @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props) => React.createElement(Text, props, "Icon"),
    MaterialCommunityIcons: (props) => React.createElement(Text, props, "Icon"),
  };
});

// Mock de expo-linear-gradient
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: (props) => React.createElement(View, props),
  };
});

// Polyfills
global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));

// Reanimated Mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({ sound: { unloadAsync: jest.fn(), stopAsync: jest.fn(), getStatusAsync: jest.fn() } }),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock expo-battery
jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn().mockResolvedValue(0.75),
  isLowPowerModeEnabledAsync: jest.fn().mockResolvedValue(false),
  addBatteryLevelListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addBatteryStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addLowPowerModeListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 0, longitude: 0 } }),
  watchPositionAsync: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  Accuracy: { Balanced: 3 },
}));

// Mock expo-camera
jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    CameraView: (props) => React.createElement(View, props),
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  };
});

// Mock expo-keep-awake
jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwakeAsync: jest.fn(),
}));
