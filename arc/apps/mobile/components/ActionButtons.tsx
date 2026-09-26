import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActionButtonsProps {
  onNavigate: (route: string) => void;
  onEmergencyPress: () => void;
  t: Record<string, string>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onNavigate, onEmergencyPress, t }) => {
  return (
    <View style={styles.container}>
      {/* High-Visibility Emergency Button (Full Width) */}
      <TouchableOpacity
        style={styles.emergencyBtn}
        onPress={onEmergencyPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS button"
      >
        <Text style={styles.emergencyEmoji}>🆘</Text>
        <View>
          <Text style={styles.emergencyTitle}>{t.emergency || 'EMERGENCY'}</Text>
          <Text style={styles.emergencySubtitle}>{t.emergencySubtitle || 'Tap for immediate help'}</Text>
        </View>
      </TouchableOpacity>

      {/* Grid of Main Services */}
      <View style={styles.grid}>
        {/* Medicines */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#0F766E' }]}
          onPress={() => onNavigate('Medicines')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>💊</Text>
          <Text style={styles.cardTitle}>{t.medicines || 'Medicines'}</Text>
          <Text style={styles.cardSubtitle}>{t.medicinesSubtitle || '3/3 Taken'}</Text>
        </TouchableOpacity>

        {/* My Health */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#E11D48' }]}
          onPress={() => onNavigate('Health')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>❤️</Text>
          <Text style={styles.cardTitle}>{t.myHealth || 'My Health'}</Text>
          <Text style={styles.cardSubtitle}>{t.myHealthSubtitle || 'BP 124/78'}</Text>
        </TouchableOpacity>

        {/* Family */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#4F46E5' }]}
          onPress={() => onNavigate('Family')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>📞</Text>
          <Text style={styles.cardTitle}>{t.family || 'Family'}</Text>
          <Text style={styles.cardSubtitle}>{t.familySubtitle || 'Call loved ones'}</Text>
        </TouchableOpacity>

        {/* Appointments */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#D97706' }]}
          onPress={() => onNavigate('Appointments')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>📅</Text>
          <Text style={styles.cardTitle}>{t.appointments || 'Appointments'}</Text>
          <Text style={styles.cardSubtitle}>{t.appointmentsSubtitle || 'Tomorrow 10:30'}</Text>
        </TouchableOpacity>

        {/* Senior Schemes */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#0284C7' }]}
          onPress={() => onNavigate('Government')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>🏛️</Text>
          <Text style={styles.cardTitle}>{t.government || 'Senior Schemes'}</Text>
          <Text style={styles.cardSubtitle}>{t.governmentSubtitle || 'Pension & Benefits'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
    gap: 14,
  },
  emergencyBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 84, // Very large touch target
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyEmoji: {
    fontSize: 42,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emergencySubtitle: {
    color: '#FEE2E2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
});
