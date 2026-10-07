import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../constants/config';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando información...',
  fullScreen = true,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={THEME_COLORS.accent} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: THEME_COLORS.textMuted,
    fontWeight: '500',
  },
});