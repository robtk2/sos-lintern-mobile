# SOS Lintern 🔦🚨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Coverage](https://img.shields.io/badge/coverage-96.29%25-brightgreen)](https://jestjs.io/)
[![Expo](https://img.shields.io/badge/Expo-54-blue)](https://expo.dev/)

**SOS Lintern** is a professional-grade emergency signaling application built with React Native and Expo. Designed for high reliability in critical situations, it features highly accurate Morse code signaling, passive location tracking, and intelligent battery management.

---

## 🌍 Languages / Idiomas
- [English](#english)
- [Español](#español)

---

<a name="english"></a>
## 🇬🇧 English

### 🚀 Key Features
- **Visual SOS**: High-precision Morse code signaling using the device's camera flashlight.
- **Audio Sync**: Synchronized Morse audio sequence that works offline.
- **Auto-Stop Timer**: Configure durations with a custom high-fidelity wheel picker.
- **Live Learning Battery Heuristics**: Dynamically learns your device's battery drain to provide accurate time-remaining estimates.
- **Rescue Coordinates**: Real-time GPS location display optimized for low battery consumption.
- **Safety Thresholds**: Automatic shut-off when battery reaches critical levels (customizable).

### 🛠️ Tech Stack
- **Framework**: React Native (Expo SDK 54)
- **State Management**: Zustand (Atomic Logic)
- **Architecture**: Hexagonal (Clean Services) + Atomic Design (UI)
- **Animations**: React Native Reanimated v4
- **Testing**: Jest + React Native Testing Library (**96.29% Coverage**)

### 📦 Installation
1. Clone the repo: `git clone ...`
2. Install dependencies: `npm install --legacy-peer-deps`
3. Run: `npx expo start`

### 🧪 Testing
Check the integrity of the project:
```bash
npm run test:coverage
```

---

<a name="español"></a>
## 🇪🇸 Español

**SOS Lintern** es una aplicación de señalización de emergencia de grado profesional. Diseñada para ofrecer la máxima fiabilidad en situaciones críticas.

### 🚀 Características Principales
- **SOS Visual**: Señalización Morse de alta precisión usando el flash de la cámara.
- **Sincronización de Audio**: Secuencia de audio Morse sincronizada que funciona sin conexión.
- **Temporizador de Auto-Parada**: Configura la duración del envío con un selector de tiempo de alta fidelidad.
- **Heurística de Batería Inteligente**: Aprende dinámicamente el consumo de tu dispositivo para dar estimaciones precisas de "tiempo restante".
- **Coordenadas de Rescate**: Visualización de GPS en tiempo real optimizada para bajo consumo.
- **Umbrales de Seguridad**: Apagado automático cuando la batería alcanza niveles críticos.

### 🏗️ Arquitectura y Calidad
- **Arquitectura Hexagonal**: Servicios desacoplados del framework para máxima testabilidad.
- **Diseño Atómico**: Componentes de UI modulares y reutilizables.
- **Cobertura de Tests**: **+96%** de líneas cubiertas, garantizando la estabilidad de la lógica de emergencia.

### 📦 Instalación
1. Clonar: `git clone ...`
2. Instalar: `npm install --legacy-peer-deps`
3. Iniciar: `npx expo start`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

Created with ❤️ for survival and safety.
