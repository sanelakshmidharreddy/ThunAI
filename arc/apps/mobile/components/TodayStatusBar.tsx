import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TodayStatusBarProps {
  medicineTaken: number;
  medicineTotal: number;
  checkInDone: boolean;
  t: Record<string, string>;
}

export const TodayStatusBar: React.FC<TodayStatusBarProps> = ({
  medicineTaken,
  medicineTotal,
  checkInDone,
  t,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>TODAY'S STATUS</Text>
      
      <View style={styles.row}>
        {/* Medicine */}
        <View style={styles.item}>
          <Text style={styles.itemEmoji}>💊</Text>
          <View>
            <Text style={styles.itemTitle}>Medicine</Text>
            <Text style={styles.itemStatus}>
              {medicineTaken}/{medicineTotal} Taken
            </Text>
          </View>
        </View>

        {/* Check-In */}
        <View style={styles.item}>
          <Text style={styles.itemEmoji}>😊</Text>
          <View>
            <Text style={styles.itemTitle}>Check-in</Text>
            <Text style={[styles.itemStatus, { color: checkInDone ? '#16A34A' : '#D97706' }]}>
              {checkInDone ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Health */}
        <View style={styles.item}>
          <Text style={styles.itemEmoji}>🩺</Text>
          <View>
            <Text style={styles.itemTitle}>Health</Text>
            <Text style={styles.itemStatus}>Updated</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
    marginTop: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  itemStatus: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
});
