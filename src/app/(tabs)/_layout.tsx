import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../constants/config';

export default function TabLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: THEME_COLORS.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '800' },
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: THEME_COLORS.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: THEME_COLORS.accent,
        tabBarInactiveTintColor: THEME_COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tickets',
          headerTitle: 'Mesa de Ayuda · Tickets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Reportar',
          headerTitle: 'Registrar Incidencia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerTitle: 'Configuración API',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}