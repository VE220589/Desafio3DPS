// src/app/detail/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Ticket,
  TicketStatus,
  TicketDepartment,
  TicketPriority,
  UpdateTicketDTO,
} from '../../types/Entity';
import { resourceService } from '../../services/resourceService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CustomInput } from '../../components/CustomInput';
import {
  THEME_COLORS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  STATUSES,
  DEPARTMENTS,
  PRIORITIES,
} from '../../constants/config';

export default function TicketDetailScreen(): JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [eliminando, setEliminando] = useState<boolean>(false);

  // Estados de edición del formulario
  const [editando, setEditando] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<TicketDepartment>('Sistemas');
  const [priority, setPriority] = useState<TicketPriority>('Media');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<TicketStatus>('Abierto');

  // 1. GET /tickets/:id — Cargar datos del ticket por ID dinámico
  const cargarDetalleTicket = async (): Promise<void> => {
    if (!id) return;
    setCargando(true);
    try {
      const data = await resourceService.getTicketById(id);
      setTicket(data);
      // Sincronizar estados locales de edición
      setTitle(data.title);
      setDepartment(data.department);
      setPriority(data.priority);
      setDescription(data.description);
      setStatus(data.status);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo cargar el ticket';
      Alert.alert('Error al consultar', msg, [
        { text: 'Regresar', onPress: () => router.back() },
      ]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDetalleTicket();
  }, [id]);

  // 2. PUT/PATCH — Cambio rápido de estado con confirmación (Requisito UX)
  const handleCambiarEstado = (nuevoEstado: TicketStatus): void => {
    if (!ticket || nuevoEstado === ticket.status) return;

    Alert.alert(
      'Confirmar Cambio de Estado',
      `¿Deseas cambiar el estado del ticket a "${nuevoEstado}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cambiar',
          onPress: async () => {
            setGuardando(true);
            try {
              const actualizado = await resourceService.updateTicket(ticket.id, {
                status: nuevoEstado,
              });
              setTicket(actualizado);
              setStatus(actualizado.status);
              Alert.alert('Estado Actualizado', `El ticket ahora está en: ${nuevoEstado}`);
            } catch (error) {
              const msg = error instanceof Error ? error.message : 'Error al actualizar estado';
              Alert.alert('Error', msg);
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  // 3. PUT/PATCH — Guardar modificaciones completas del formulario
  const handleGuardarCambios = async (): Promise<void> => {
    if (!ticket) return;

    if (title.trim().length < 5) {
      Alert.alert('Validación', 'El título debe tener al menos 5 caracteres.');
      return;
    }
    if (description.trim().length < 10) {
      Alert.alert('Validación', 'La descripción debe tener al menos 10 caracteres.');
      return;
    }

    setGuardando(true);
    try {
      const payload: UpdateTicketDTO = {
        title: title.trim(),
        department,
        priority,
        status,
        description: description.trim(),
      };

      const actualizado = await resourceService.updateTicket(ticket.id, payload);
      setTicket(actualizado);
      setEditando(false);
      Alert.alert('Éxito', 'Incidencia actualizada en MockAPI correctamente');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo actualizar el ticket';
      Alert.alert('Error al guardar', msg);
    } finally {
      setGuardando(false);
    }
  };

  // 4. DELETE /tickets/:id — Eliminar con alerta de confirmación
  const handleEliminarTicket = (): void => {
    if (!ticket) return;

    Alert.alert(
      'Eliminar Incidencia',
      `¿Estás seguro de que deseas eliminar permanentemente el ticket #${ticket.id}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Definitivamente',
          style: 'destructive',
          onPress: async () => {
            setEliminando(true);
            try {
              await resourceService.deleteTicket(ticket.id);
              Alert.alert('Ticket Eliminado', 'El registro fue borrado de MockAPI.', [
                {
                  text: 'Aceptar',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              const msg = error instanceof Error ? error.message : 'No se pudo eliminar';
              Alert.alert('Error al eliminar', msg);
              setEliminando(false);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return <LoadingSpinner message="Consultando detalles del ticket en el servidor..." />;
  }

  if (!ticket) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={56} color={THEME_COLORS.danger} />
        <Text style={styles.errorTitle}>Ticket no encontrado</Text>
        <TouchableOpacity style={styles.btnVolver} onPress={() => router.back()}>
          <Text style={styles.btnVolverText}>Regresar a la lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusTheme = STATUS_COLORS[ticket.status] || { bg: '#E2E8F0', text: '#334155' };
  const priorityColor = PRIORITY_COLORS[ticket.priority] || THEME_COLORS.textMuted;
  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No registrada';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Cabecera con imagen y resumen */}
      <Image
        source={{
          uri:
            ticket.imageUrl ||
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
        }}
        style={styles.heroImage}
      />

      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
            <View style={[styles.dot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              Prioridad {ticket.priority}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
            <Text style={[styles.statusText, { color: statusTheme.text }]}>
              {ticket.status}
            </Text>
          </View>
        </View>

        <Text style={styles.ticketId}>TICKET #{ticket.id} · {ticket.department}</Text>
        <Text style={styles.ticketTitle}>{ticket.title}</Text>
        <Text style={styles.ticketDate}>📅 Registrado el {formattedDate}</Text>
      </View>

      {/* Selector rápido de estado mediante Chips (Requisito UX) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Actualizar Estado del Ticket</Text>
        <Text style={styles.sectionSubtitle}>
          Toca un estado para actualizarlo en tiempo real en la API:
        </Text>
        <View style={styles.statusChipsRow}>
          {STATUSES.map((st) => {
            const activo = ticket.status === st;
            const theme = STATUS_COLORS[st];
            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.statusChip,
                  activo
                    ? { backgroundColor: theme.text, borderColor: theme.text }
                    : { backgroundColor: THEME_COLORS.surface, borderColor: THEME_COLORS.border },
                ]}
                onPress={() => handleCambiarEstado(st)}
                disabled={guardando}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    activo ? { color: '#FFFFFF' } : { color: THEME_COLORS.text },
                  ]}
                >
                  {activo ? '✓ ' : ''}{st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Modo Lectura vs Modo Edición */}
      {!editando ? (
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Descripción del Fallo</Text>
            <TouchableOpacity onPress={() => setEditando(true)} style={styles.btnEditarInline}>
              <Ionicons name="create-outline" size={16} color={THEME_COLORS.accent} />
              <Text style={styles.btnEditarInlineText}>Editar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText}>{ticket.description}</Text>
        </View>
      ) : (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Modificar Datos de la Incidencia</Text>

          <CustomInput
            label="Título *"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.fieldLabel}>Departamento</Text>
          <View style={styles.chipsWrap}>
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[styles.smallChip, department === dept && styles.smallChipActive]}
                onPress={() => setDepartment(dept)}
              >
                <Text style={[styles.smallChipText, department === dept && styles.smallChipTextActive]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Prioridad</Text>
          <View style={styles.chipsWrap}>
            {PRIORITIES.map((p) => {
              const color = PRIORITY_COLORS[p];
              const activo = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.smallChip,
                    activo && { backgroundColor: color, borderColor: color },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.smallChipText,
                      activo ? { color: '#FFFFFF' } : { color: THEME_COLORS.text },
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomInput
            label="Observaciones o Descripción *"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.editButtonsRow}>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => {
                setEditando(false);
                setTitle(ticket.title);
                setDescription(ticket.description);
                setDepartment(ticket.department);
                setPriority(ticket.priority);
              }}
              disabled={guardando}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnGuardar}
              onPress={handleGuardarCambios}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnGuardarText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón de Eliminación (DELETE) */}
      <TouchableOpacity
        style={[styles.btnEliminar, eliminando && styles.buttonDisabled]}
        onPress={handleEliminarTicket}
        disabled={eliminando || guardando}
      >
        {eliminando ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnEliminarText}>Eliminar o Anular Ticket</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: THEME_COLORS.background,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME_COLORS.background,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginTop: 10,
    marginBottom: 16,
  },
  btnVolver: {
    backgroundColor: THEME_COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnVolverText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: '#CBD5E1',
    marginBottom: 14,
  },
  cardHeader: {
    backgroundColor: THEME_COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  ticketId: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME_COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME_COLORS.text,
    marginVertical: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: THEME_COLORS.textMuted,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: THEME_COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME_COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME_COLORS.textMuted,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: THEME_COLORS.text,
    lineHeight: 22,
  },
  btnEditarInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnEditarInlineText: {
    color: THEME_COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  statusChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginBottom: 6,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  smallChipActive: {
    backgroundColor: THEME_COLORS.accent,
    borderColor: THEME_COLORS.accent,
  },
  smallChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME_COLORS.textMuted,
  },
  smallChipTextActive: {
    color: '#FFFFFF',
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCancelarText: {
    color: THEME_COLORS.text,
    fontWeight: '700',
    fontSize: 13,
  },
  btnGuardar: {
    flex: 2,
    backgroundColor: THEME_COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnGuardarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  btnEliminar: {
    backgroundColor: THEME_COLORS.danger,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  btnEliminarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});