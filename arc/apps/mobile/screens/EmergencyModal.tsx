import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';

interface EmergencyModalProps {
  language: LanguageCode;
  isOpen: boolean;
  isTriggered: boolean;
  onConfirmSos: () => void;
  onCancel: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  language,
  isOpen,
  isTriggered,
  onConfirmSos,
  onCancel,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.sosEmoji}>🚨</Text>

          <Text style={styles.title}>
            {isTriggered ? 'SOS ALERT SENT' : t.sosTitle || 'EMERGENCY HELP'}
          </Text>

          <Text style={styles.message}>
            {isTriggered
              ? t.callingCaregivers || 'Your family and emergency contacts have been alerted. Stay calm, help is on the way.'
              : t.sosConfirm || 'Do you need immediate emergency help?'}
          </Text>

          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
              📍 Location: Mylapore, Chennai (13.0827, 80.2707)
            </Text>
          </View>

          {isTriggered ? (
            <TouchableOpacity style={styles.dismissBtn} onPress={onCancel}>
              <Text style={styles.dismissBtnText}>DISMISS</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnYes]}
                onPress={onConfirmSos}
                accessibilityRole="button"
              >
                <Text style={styles.btnYesText}>
                  {t.yesCallHelp || 'YES, CALL HELP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnCancel]}
                onPress={onCancel}
                accessibilityRole="button"
              >
                <Text style={styles.btnCancelText}>
                  {t.cancel || 'CANCEL'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  sosEmoji: {
    fontSize: 54,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  locationBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    width: '100%',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    textAlign: 'center',
  },
  btnRow: {
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    width: '100%',
    minHeight: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnYes: {
    backgroundColor: '#DC2626',
  },
  btnYesText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnCancel: {
    backgroundColor: '#E2E8F0',
  },
  btnCancelText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '800',
  },
  dismissBtn: {
    backgroundColor: '#1E293B',
    width: '100%',
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
