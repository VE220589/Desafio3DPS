import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Ticket, TicketPriority } from '../../types/Entity';
import { resourceService } from '../../services/resourceService';
import { ItemCard } from '../../components/ItemCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { THEME_COLORS, PRIORITIES } from '../../constants/config';

export default function TicketsListScreen(): JSX.Element {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [refrescando, setRefrescando] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [prioridadFiltro, setPrioridadFiltro] = useState<string>('Todas');

  // Cargar tickets desde la API mediante Axios
  const obtenerTickets = async (): Promise<void> => {
    try {
      const data = await resourceService.getTickets();
      // Ordenar los más recientes primero
      const ordenados = [...data].reverse();
      setTickets(ordenados);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al conectar con la API';
      Alert.alert('Error de Red', msg);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  // Recarga automática al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      obtenerTickets();
    }, [])
  );

  // Filtrado reactivo en memoria por texto y prioridad
  // y filtrado seguro contra valores undefined o nulos
  const ticketsFiltrados = tickets.filter((t) => {
    if (!t) return false;

    const query = (busqueda || '').toLowerCase();
    const titulo = (t.title || '').toLowerCase();
    const depto = (t.department || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();

    const coincideTexto =
      titulo.includes(query) ||
      depto.includes(query) ||
      desc.includes(query);

    const coincidePrioridad =
      prioridadFiltro === 'Todas' || t.priority === prioridadFiltro;

    return coincideTexto && coincidePrioridad;
  });

  if (cargando) {
    return <LoadingSpinner message="Consultando tickets en el servidor..." />;
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={THEME_COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, departamento..."
          placeholderTextColor={THEME_COLORS.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={THEME_COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Chips de filtro por prioridad */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, prioridadFiltro === 'Todas' && styles.filterChipActive]}
          onPress={() => setPrioridadFiltro('Todas')}
        >
          <Text
            style={[styles.filterChipText, prioridadFiltro === 'Todas' && styles.filterChipTextActive]}
          >
            Todas ({tickets.length})
          </Text>
        </TouchableOpacity>

        {PRIORITIES.map((p) => {
          const cantidad = tickets.filter((t) => t.priority === p).length;
          const activa = prioridadFiltro === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.filterChip, activa && styles.filterChipActive]}
              onPress={() => setPrioridadFiltro(p)}
            >
              <Text style={[styles.filterChipText, activa && styles.filterChipTextActive]}>
                {p} ({cantidad})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Listado con FlatList */}
      <FlatList
        data={ticketsFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => router.push(`/detail/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={() => {
              setRefrescando(true);
              obtenerTickets();
            }}
            colors={[THEME_COLORS.accent]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={54} color={THEME_COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No se encontraron tickets</Text>
            <Text style={styles.emptySubtitle}>
              {busqueda
                ? 'Intenta con otro término de búsqueda o filtro.'
                : 'Registra un nuevo ticket desde la pestaña "Reportar".'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: THEME_COLORS.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  filterChipActive: {
    backgroundColor: THEME_COLORS.accent,
    borderColor: THEME_COLORS.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_COLORS.textMuted,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});