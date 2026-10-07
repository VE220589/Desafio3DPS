import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { THEME_COLORS } from '../constants/config';

interface CustomInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage,
  style,
  multiline,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          Boolean(errorMessage) && styles.inputError,
          style,
        ]}
        placeholderTextColor={THEME_COLORS.textMuted}
        multiline={multiline}
        {...rest}
      />
      {errorMessage ? <Text style={styles.errorText}>⚠ {errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1.5,
    borderColor: THEME_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: THEME_COLORS.text,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: THEME_COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: THEME_COLORS.danger,
    fontWeight: '600',
  },
});