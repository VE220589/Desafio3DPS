import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  TicketDepartment,
  TicketPriority,
  CreateTicketDTO,
} from '../../types/Entity';
import { resourceService } from '../../services/resourceService';
import { CustomInput } from '../../components/CustomInput';
import {
  THEME_COLORS,
  DEPARTMENTS,
  PRIORITIES,
  PRIORITY_COLORS,
} from '../../constants/config';

export default function CreateTicketScreen(): JSX.Element {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<TicketDepartment>('Sistemas');
  const [priority, setPriority] = useState<TicketPriority>('Media');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState<boolean>(false);

  // Validación de formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!title.trim()) {
      nuevosErrores.title = 'El título de la incidencia es obligatorio';
    } else if (title.trim().length < 5) {
      nuevosErrores.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!description.trim()) {
      nuevosErrores.description = 'La descripción del fallo es obligatoria';
    } else if (description.trim().length < 10) {
      nuevosErrores.description = 'Describe el fallo con al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleCrearTicket = async (): Promise<void> => {
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      const nuevoTicket: CreateTicketDTO = {
        title: title.trim(),
        department,
        priority,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
      };

      await resourceService.createTicket(nuevoTicket);

      Alert.alert('Éxito', 'Ticket registrado en MockAPI correctamente', [
        {
          text: 'Ver Tickets',
          onPress: () => {
            // Limpiar formulario y volver al listado
            setTitle('');
            setDescription('');
            setImageUrl('');
            setDepartment('Sistemas');
            setPriority('Media');
            router.push('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo crear el ticket';
      Alert.alert('Error', msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionHeader}>Información de la Incidencia</Text>

      <CustomInput
        label="Título del problema *"
        placeholder="Ej. Servidor de correo sin conexión"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errores.title) setErrores((prev) => ({ ...prev, title: '' }));
        }}
        errorMessage={errores.title}
      />

      {/* Selector de Departamento */}
      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Departamento Afectado *</Text>
        <View style={styles.chipsWrap}>
          {DEPARTMENTS.map((dept) => {
            const activo = department === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[styles.chip, activo && styles.chipActive]}
                onPress={() => setDepartment(dept)}
              >
                <Text style={[styles.chipText, activo && styles.chipTextActive]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selector de Prioridad */}
      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Nivel de Prioridad *</Text>
        <View style={styles.chipsWrap}>
          {PRIORITIES.map((p) => {
            const activo = priority === p;
            const color = PRIORITY_COLORS[p];
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  activo && { backgroundColor: color, borderColor: color },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    activo ? { color: '#FFFFFF' } : { color: THEME_COLORS.text },
                  ]}
                >
                  ● {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <CustomInput
        label="Descripción del fallo *"
        placeholder="Detalla los síntomas, equipos afectados y pasos para reproducir..."
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (errores.description) setErrores((prev) => ({ ...prev, description: '' }));
        }}
        multiline
        numberOfLines={4}
        errorMessage={errores.description}
      />

      <CustomInput
        label="URL de Evidencia o Foto (Opcional)"
        placeholder="https://images.unsplash.com/..."
        value={imageUrl}
        onChangeText={setImageUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.submitButton, enviando && styles.buttonDisabled]}
        onPress={handleCrearTicket}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Generar Ticket de Soporte</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: THEME_COLORS.background,
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME_COLORS.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorGroup: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1.5,
    borderColor: THEME_COLORS.border,
  },
  chipActive: {
    backgroundColor: THEME_COLORS.accent,
    borderColor: THEME_COLORS.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME_COLORS.textMuted,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: THEME_COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});