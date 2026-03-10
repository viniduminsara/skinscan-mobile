# SkinScan Mobile App

The mobile companion for the SkinScan project, built with Expo and React Native. It allows users to capture skin images directly via camera, receive AI-powered analysis, and track history.

## Features

- **Camera Integration**: Easy image capture using `expo-image-picker`.
- **Real-time Analysis**: Swift interaction with the ML-powered backend API.
- **Scan History**: Full track record of previous scans with risk level indicators.
- **PDF Reports**: In-app generation and sharing of medical-style analysis reports.
- **Interactive Charts**: Progress tracking for skin conditions over time.
- **User Authentication**: Secure login and Supabase/Google integration.

## Tech Stack

- **Framework**: Expo (SDK 54)
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Components**: React Native with custom design system
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage
- **PDF/Printing**: Expo Print, Expo Sharing

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your mobile device OR an emulator.

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd skinscan-mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file or export the following variables:

```env
EXPO_PUBLIC_API_URL=http://your-local-ip:8080/api/v1
```

### Running the App

Start the Expo development server:

```bash
npm start
```

- Press **i** for iOS simulator.
- Press **a** for Android emulator.
- Scan the QR code with **Expo Go** to run on a physical device.

## Project Structure

- `app/`: Expo Router directory handles screens and navigation.
- `src/components/`: Reusable native components.
- `src/lib/`: API client and utility logic.
- `src/theme/`: Shared color, spacing, and typography tokens.
