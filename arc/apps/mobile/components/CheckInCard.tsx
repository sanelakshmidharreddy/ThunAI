import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CheckInCardProps {
  onCheckIn: (response: 'FINE' | 'NEED_HELP' | 'NOT_WELL' | 'URGENT_HELP') => void;
  completedToday: boolean;
  t: Record<string, string>;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({ onCheckIn, completedToday, t }) => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  const handleSelect = (val: 'FINE' | 'NEED_HELP' | 'NOT_WELL' | 'URGENT_HELP') => {
    setSelectedResponse(val);
    onCheckIn(val);
  };

  if (completedToday && !selectedResponse) {
    return (
      <View style={styles.completedCard}>
        <Text style={styles.completedEmoji}>✅</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.completedTitle}>Morning Check-in Recorded</Text>
          <Text style={styles.completedSubtitle}>{t.checkInDone || 'Thank you! Your family knows you are doing well.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.checkInTitle || 'How are you feeling today?'}</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.btn, styles.btnFine]}
          onPress={() => handleSelect('FINE')}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{t.feelingFine || '😊 I am fine'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnHelp]}
          onPress={() => handleSelect('NEED_HELP')}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{t.needHelp || '😐 I need some help'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnNotWell]}
          onPress={() => handleSelect('NOT_WELL')}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{t.notWell || '😟 Not feeling well'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnUrgent]}
          onPress={() => handleSelect('URGENT_HELP')}
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, styles.btnTextUrgent]}>{t.urgentHelp || '🆘 I need urgent help'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    textAlign: 'center',
  },
  grid: {
    gap: 10,
  },
  btn: {
    minHeight: 56, // Extra large touch target for elderly
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  btnFine: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  btnHelp: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  btnNotWell: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  btnUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  btnTextUrgent: {
    color: '#DC2626',
    fontWeight: '800',
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  completedEmoji: {
    fontSize: 28,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
  },
  completedSubtitle: {
    fontSize: 14,
    color: '#15803D',
    marginTop: 2,
  },
});
