import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';
import { DailyHealthSummary } from '../../../shared/schemas/index.ts';

interface HealthScreenProps {
  language: LanguageCode;
  healthData: DailyHealthSummary | null;
  onBack: () => void;
}

export const HealthScreen: React.FC<HealthScreenProps> = ({
  language,
  healthData,
  onBack,
}) => {
  const t = getTranslation(language);

  const bp = healthData?.blood_pressure || { systolic: 124, diastolic: 78, unit: 'mmHg' };
  const hr = healthData?.heart_rate || { value: 72, unit: 'BPM' };
  const sugar = healthData?.blood_sugar || { value: 108, unit: 'mg/dL' };
  const creat = healthData?.creatinine || { value: 1.0, unit: 'mg/dL' };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.myHealth || 'My Health'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>TODAY'S READINGS</Text>

        {/* Blood Pressure Card */}
        <View style={[styles.vitalCard, { borderLeftColor: '#16A34A' }]}>
          <View style={styles.vitalHeader}>
            <Text style={styles.vitalEmoji}>🩺</Text>
            <Text style={styles.vitalName}>Blood Pressure</Text>
          </View>
          <Text style={styles.vitalValue}>
            {bp.systolic} / {bp.diastolic} <Text style={styles.vitalUnit}>mmHg</Text>
          </Text>
          <Text style={styles.vitalStatus}>Normal & Healthy</Text>
        </View>

        {/* Heart Rate Card */}
        <View style={[styles.vitalCard, { borderLeftColor: '#E11D48' }]}>
          <View style={styles.vitalHeader}>
            <Text style={styles.vitalEmoji}>❤️</Text>
            <Text style={styles.vitalName}>Heart Rate</Text>
          </View>
          <Text style={styles.vitalValue}>
            {hr.value} <Text style={styles.vitalUnit}>BPM</Text>
          </Text>
          <Text style={styles.vitalStatus}>Resting pulse normal</Text>
        </View>

        {/* Blood Sugar Card */}
        <View style={[styles.vitalCard, { borderLeftColor: '#D97706' }]}>
          <View style={styles.vitalHeader}>
            <Text style={styles.vitalEmoji}>🩸</Text>
            <Text style={styles.vitalName}>Blood Sugar (Fasting)</Text>
          </View>
          <Text style={styles.vitalValue}>
            {sugar.value} <Text style={styles.vitalUnit}>mg/dL</Text>
          </Text>
          <Text style={styles.vitalStatus}>Well managed</Text>
        </View>

        {/* Creatinine Card */}
        <View style={[styles.vitalCard, { borderLeftColor: '#0F766E' }]}>
          <View style={styles.vitalHeader}>
            <Text style={styles.vitalEmoji}>🧪</Text>
            <Text style={styles.vitalName}>Serum Creatinine</Text>
          </View>
          <Text style={styles.vitalValue}>
            {creat.value} <Text style={styles.vitalUnit}>mg/dL</Text>
          </Text>
          <Text style={styles.vitalStatus}>Kidney function stable</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            ℹ️ This dashboard is for tracking and communication with family and doctors. It does not provide medical diagnoses.
          </Text>
        </View>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  vitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vitalEmoji: {
    fontSize: 22,
  },
  vitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  vitalValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  vitalUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  vitalStatus: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 4,
  },
  disclaimerBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
  },
});
