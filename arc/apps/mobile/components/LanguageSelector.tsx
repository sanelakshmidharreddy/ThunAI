import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { LANGUAGE_OPTIONS } from '../i18n/index.ts';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onSelectLanguage }) => {
  return (
    <View style={styles.container}>
      {LANGUAGE_OPTIONS.map((opt) => {
        const isSelected = opt.code === currentLanguage;
        return (
          <TouchableOpacity
            key={opt.code}
            onPress={() => onSelectLanguage(opt.code)}
            style={[styles.langButton, isSelected && styles.langButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={`Switch language to ${opt.label}`}
          >
            <Text style={[styles.langText, isSelected && styles.langTextActive]}>
              {opt.nativeName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    minHeight: 44, // Large touch target
    justifyContent: 'center',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: '#0F766E', // Teal primary
    borderColor: '#0F766E',
  },
  langText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
});
