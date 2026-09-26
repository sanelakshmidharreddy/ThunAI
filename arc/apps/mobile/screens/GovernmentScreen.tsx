import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';
import { fetchGovernmentSchemes } from '../services/api.ts';

interface GovernmentScreenProps {
  language: LanguageCode;
  onBack: () => void;
}

export const GovernmentScreen: React.FC<GovernmentScreenProps> = ({ language, onBack }) => {
  const t = getTranslation(language);
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    fetchGovernmentSchemes()
      .then((data) => setSchemes(data))
      .catch(() => setSchemes([]));
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.government || 'Senior Schemes'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🏛️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Verified Government Welfare</Text>
            <Text style={styles.bannerSub}>
              Official information on pensions, healthcare, and national elder helplines.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>AVAILABLE SERVICES & SCHEMES</Text>

        {schemes.map((s) => (
          <View key={s.id} style={styles.schemeCard}>
            <View style={styles.cardTop}>
              <Text style={styles.categoryBadge}>{s.category}</Text>
              {s.phone && (
                <View style={styles.phoneBadge}>
                  <Text style={styles.phoneText}>📞 {s.phone}</Text>
                </View>
              )}
            </View>

            <Text style={styles.schemeTitle}>{s.title}</Text>
            <Text style={styles.schemeSummary}>{s.summary}</Text>

            <View style={styles.benefitsBox}>
              <Text style={styles.benefitsLabel}>Benefits:</Text>
              <Text style={styles.benefitsText}>{s.benefits}</Text>
            </View>

            <View style={styles.sourceBox}>
              <Text style={styles.sourceText}>Source: {s.source}</Text>
              <Text style={styles.disclaimerText}>{s.disclaimer}</Text>
            </View>
          </View>
        ))}
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
  banner: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  bannerEmoji: {
    fontSize: 32,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0369A1',
  },
  bannerSub: {
    fontSize: 14,
    color: '#0284C7',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  schemeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    fontWeight: '800',
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  phoneBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  phoneText: {
    color: '#15803D',
    fontWeight: '800',
    fontSize: 12,
  },
  schemeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  schemeSummary: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  benefitsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  benefitsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 2,
  },
  benefitsText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  sourceBox: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
