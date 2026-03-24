import React, { useEffect } from 'react';
import { Stack } from "expo-router";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import "./src/i18n/i18n"; // Import i18n
import { useTranslation } from "react-i18next";
import * as Updates from 'expo-updates';

export default function RootLayout() {
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.warn(`Error fetching latest Expo update: ${error}`);
      }
    }
    
    // In production, check for OTA updates
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
