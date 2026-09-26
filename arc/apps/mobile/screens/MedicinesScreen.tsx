import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';
import { MedicineStatusSummary } from '../../../shared/schemas/index.ts';

interface MedicinesScreenProps {
  language: LanguageCode;
  summary: MedicineStatusSummary | null;
  onTakeDose: (eventId: string) => void;
  onSkipDose: (eventId: string) => void;
  onRemindLater: (eventId: string) => void;
  onBack: () => void;
}

export const MedicinesScreen: React.FC<MedicinesScreenProps> = ({
  language,
  summary,
  onTakeDose,
  onSkipDose,
  onRemindLater,
  onBack,
}) => {
  const t = getTranslation(language);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.medicines || 'Medicines'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Compliance Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEmoji}>💊</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {summary ? `${summary.taken_count} of ${summary.total_scheduled} Taken` : 'Daily Doses'}
            </Text>
            <Text style={styles.summarySub}>
              {summary && summary.adherence_percentage === 100
                ? t.allTaken || 'All medicines taken today!'
                : 'Please take your scheduled tablets on time.'}
            </Text>
          </View>
        </View>

        {/* Medicines List */}
        <Text style={styles.listHeader}>TODAY'S DOSES</Text>

        {(!summary || summary.events.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medications scheduled for today.</Text>
          </View>
        ) : (
          summary.events.map((e) => {
            const timeStr = new Date(e.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isPending = e.status === 'PENDING';
            const isTaken = e.status === 'TAKEN';

            return (
              <View
                key={e.id}
                style={[
                  styles.medCard,
                  isTaken && styles.medCardTaken,
                  isPending && styles.medCardPending,
                ]}
              >
                <View style={styles.medCardTop}>
                  <View>
                    <Text style={styles.medName}>{e.medicine_name || 'Prescribed Tablet'}</Text>
                    <Text style={styles.medDetail}>{e.dosage_info || '1 tablet'} • {timeStr}</Text>
                    {e.instructions && (
                      <Text style={styles.medInstructions}>📝 {e.instructions}</Text>
                    )}
                  </View>
                  <View>
                    {isTaken ? (
                      <Text style={styles.takenBadge}>✓ TAKEN</Text>
                    ) : (
                      <Text style={styles.pendingBadge}>PENDING</Text>
                    )}
                  </View>
                </View>

                {/* Big Action Buttons for pending dose */}
                {isPending && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.doseBtn, styles.doseBtnTaken]}
                      onPress={() => onTakeDose(e.id)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.doseBtnTakenText}>{t.taken || 'TAKEN'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.doseBtn, styles.doseBtnLater]}
                      onPress={() => onRemindLater(e.id)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.doseBtnLaterText}>{t.remindLater || 'LATER'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.doseBtn, styles.doseBtnSkip]}
                      onPress={() => onSkipDose(e.id)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.doseBtnSkipText}>{t.skip || 'SKIP'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    minHeight: 44,
    minWidth: 60,
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F766E',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  summaryEmoji: {
    fontSize: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#166534',
  },
  summarySub: {
    fontSize: 14,
    color: '#15803D',
    marginTop: 2,
    fontWeight: '600',
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medCardTaken: {
    borderColor: '#86EFAC',
    backgroundColor: '#F9FDFB',
  },
  medCardPending: {
    borderLeftWidth: 6,
    borderLeftColor: '#0F766E',
  },
  medCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  medDetail: {
    fontSize: 15,
    color: '#475569',
    marginTop: 2,
    fontWeight: '600',
  },
  medInstructions: {
    fontSize: 13,
    color: '#0F766E',
    marginTop: 6,
    fontWeight: '600',
  },
  takenBadge: {
    color: '#16A34A',
    fontWeight: '800',
    fontSize: 13,
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pendingBadge: {
    color: '#B45309',
    fontWeight: '800',
    fontSize: 13,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  doseBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doseBtnTaken: {
    backgroundColor: '#16A34A',
    flex: 1.5,
  },
  doseBtnTakenText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  doseBtnLater: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  doseBtnLaterText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  doseBtnSkip: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  doseBtnSkipText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
  },
});
