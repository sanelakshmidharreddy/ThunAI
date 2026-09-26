import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LanguageCode, CaregiverContact } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';

interface FamilyScreenProps {
  language: LanguageCode;
  contacts: CaregiverContact[];
  onCall: (contact: CaregiverContact) => void;
  onBack: () => void;
}

export const FamilyScreen: React.FC<FamilyScreenProps> = ({
  language,
  contacts,
  onCall,
  onBack,
}) => {
  const t = getTranslation(language);

  // Default fallback contacts if not loaded
  const displayContacts: CaregiverContact[] = contacts.length > 0 ? contacts : [
    {
      id: 'cg-01',
      name: 'Rahul',
      relationship: 'Son (Primary Caregiver)',
      phone: '+91 9080503005',
      role: 'PRIMARY_CAREGIVER',
      emergency_contact: true,
      notification_permission: true,
      dashboard_access: true,
    },
    {
      id: 'cg-02',
      name: 'Dr. Priya Rao',
      relationship: 'Family Doctor',
      phone: '+91 98765 43210',
      role: 'FAMILY_MEMBER',
      emergency_contact: true,
      notification_permission: true,
      dashboard_access: true,
    },
    {
      id: 'cg-03',
      name: 'Elder Line Support',
      relationship: 'National Senior Helpline',
      phone: '14567',
      role: 'EMERGENCY_CONTACT',
      emergency_contact: true,
      notification_permission: false,
      dashboard_access: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.family || 'Family'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>
          Tap any family member below to talk with them immediately:
        </Text>

        <View style={styles.contactList}>
          {displayContacts.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.contactCard}
              onPress={() => onCall(c)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Call ${c.name} ${c.relationship}`}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>
                  {c.relationship.includes('Daughter') ? '👩‍⚕️' : c.relationship.includes('Son') ? '👨' : '📞'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactRelation}>{c.relationship}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>

              <View style={styles.callIconBtn}>
                <Text style={{ fontSize: 24 }}>📞</Text>
                <Text style={styles.callBtnLabel}>CALL</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            ℹ️ ARC provides direct audio calling to family members with safe simulation in browser environments.
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
  instruction: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 22,
  },
  contactList: {
    gap: 14,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 88, // Extra large touch target
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  contactName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  contactRelation: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  callIconBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 2,
  },
  noticeBox: {
    marginTop: 24,
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
  },
  noticeText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
