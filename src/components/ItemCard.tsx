import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ticket } from '../types/Entity';
import { THEME_COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../constants/config';

interface ItemCardProps {
  item: Ticket;
  onPress: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  const statusTheme = STATUS_COLORS[item.status] || { bg: '#E2E8F0', text: '#334155' };
  const priorityColor = PRIORITY_COLORS[item.priority] || THEME_COLORS.textMuted;

  // Formato simple de fecha
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Reciente';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{
          uri:
            item.imageUrl ||
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.department}>{item.department}</Text>
          <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footerRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
            <Text style={[styles.statusText, { color: statusTheme.text }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  department: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME_COLORS.accent,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: THEME_COLORS.textMuted,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: THEME_COLORS.textMuted,
  },
});