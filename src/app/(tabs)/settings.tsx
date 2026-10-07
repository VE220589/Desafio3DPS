import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { currentBaseUrl, updateApiBaseUrl } from '../../services/api';
import { DEFAULT_API_URL, THEME_COLORS } from '../../constants/config';
import { CustomInput } from '../../components/CustomInput';

export default function SettingsScreen(): JSX.Element {
  const [urlInput, setUrlInput] = useState<string>(currentBaseUrl);

  const handleGuardarUrl = () => {
    if (!urlInput.trim().startsWith('http')) {
      Alert.alert('URL Inválida', 'La dirección debe comenzar con http:// o https://');
      return;
    }
    updateApiBaseUrl(urlInput);
    Alert.alert('Configuración Actualizada', 'La BaseURL de Axios se actualizó en caliente.');
  };

  const handleRestaurar = () => {
    setUrlInput(DEFAULT_API_URL);
    updateApiBaseUrl(DEFAULT_API_URL);
    Alert.alert('Restaurado', 'Se restableció la URL original de MockAPI.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-done-outline" size={36} color={THEME_COLORS.accent} />
        </View>

        <Text style={styles.title}>Servicio RESTful</Text>
        <Text style={styles.subtitle}>
          Visualización y configuración del endpoint centralizado en Axios.
        </Text>

        <View style={styles.currentUrlBox}>
          <Text style={styles.currentUrlLabel}>URL ACTIVA ACTUAL:</Text>
          <Text style={styles.currentUrlText} numberOfLines={2}>
            {currentBaseUrl}
          </Text>
        </View>

        <CustomInput
          label="Modificar BaseURL de MockAPI"
          value={urlInput}
          onChangeText={setUrlInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardarUrl}>
          <Text style={styles.btnText}>Guardar y Aplicar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRestaurar} onPress={handleRestaurar}>
          <Text style={styles.btnRestaurarText}>Restablecer Valor por Defecto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: THEME_COLORS.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: THEME_COLORS.surface,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME_COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: THEME_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  currentUrlBox: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  currentUrlLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME_COLORS.textMuted,
    marginBottom: 4,
  },
  currentUrlText: {
    fontSize: 12,
    color: THEME_COLORS.text,
    fontFamily: 'monospace',
  },
  btnGuardar: {
    backgroundColor: THEME_COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnRestaurar: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnRestaurarText: {
    color: THEME_COLORS.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
});