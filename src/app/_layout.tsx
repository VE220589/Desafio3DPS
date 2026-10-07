// src/app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { THEME_COLORS } from '../constants/config';

export default function RootLayout(): JSX.Element {
  return (
    <>
      <StatusBar style="light" backgroundColor={THEME_COLORS.primary} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: THEME_COLORS.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: THEME_COLORS.background },
        }}
      >
        {/* El grupo de pestañas maneja sus propios encabezados */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Pantalla dinámica de detalle, edición y eliminación */}
        <Stack.Screen
          name="detail/[id]"
          options={{
            title: 'Detalle del Ticket',
            headerShown: true,
            headerBackTitle: 'Atrás',
          }}
        />
      </Stack>
    </>
  );
}