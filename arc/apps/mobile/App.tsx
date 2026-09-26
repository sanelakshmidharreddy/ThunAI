import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from 'react-native';
import { LanguageCode, CaregiverContact } from '../../shared/schemas/index.ts';
import { LanguageSelector } from './components/LanguageSelector.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { MedicinesScreen } from './screens/MedicinesScreen.tsx';
import { HealthScreen } from './screens/HealthScreen.tsx';
import { FamilyScreen } from './screens/FamilyScreen.tsx';
import { GovernmentScreen } from './screens/GovernmentScreen.tsx';
import { EmergencyModal } from './screens/EmergencyModal.tsx';
import { SafeCallModal } from './components/SafeCallModal.tsx';
import { useVoiceCompanion } from './hooks/useVoiceCompanion.ts';
import {
  fetchElderData,
  submitCheckInApi,
  triggerSosApi,
  markMedicineTakenApi,
  markMedicineSkipApi,
  fetchCaregiverContacts,
} from './services/api.ts';

const DEMO_ELDER_ID = 'elder-lakshmi-01';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentRoute, setCurrentRoute] = useState<string>('Home');
  const [elderData, setElderData] = useState<any>(null);
  const [contacts, setContacts] = useState<CaregiverContact[]>([]);

  // Emergency Modal State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);

  // Calling Modal State
  const [callingContact, setCallingContact] = useState<CaregiverContact | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchElderData(DEMO_ELDER_ID);
      setElderData(data);
      const cgs = await fetchCaregiverContacts(DEMO_ELDER_ID);
      if (Array.isArray(cgs)) {
        setContacts(cgs);
      }
    } catch (err) {
      console.warn('Backend connection note:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Voice Companion hook
  const {
    voiceState,
    transcript,
    aiResponse,
    pendingIntent,
    suggestedRoute,
    isContinuous,
    setIsContinuous,
    enableAssistantAndGreet,
    startListening,
    confirmPendingAction,
    sendVoiceQuery,
    speakText,
  } = useVoiceCompanion({
    elderId: DEMO_ELDER_ID,
    language,
    onNavigate: (route) => {
      if (route === 'Emergency') {
        setIsEmergencyTriggered(false);
        setIsEmergencyOpen(true);
      } else {
        setCurrentRoute(route);
      }
    },
    onCallRequested: (contact) => {
      setCallingContact({
        id: 'caregiver-rahul-01',
        name: contact.name || 'Rahul (Son)',
        relationship: contact.relationship || 'Son',
        phone: contact.phone || '9080503005',
        role: 'PRIMARY_CAREGIVER',
        notification_permission: true,
        emergency_contact: true,
        dashboard_access: true,
      });
    },
    onRefreshData: loadData,
  });

  const handleCheckIn = async (response: 'FINE' | 'NEED_HELP' | 'NOT_WELL' | 'URGENT_HELP') => {
    try {
      await submitCheckInApi(DEMO_ELDER_ID, response);
      loadData();
    } catch (e) {
      console.warn('Check-in error:', e);
    }
  };

  const handleTakeDose = async (eventId: string) => {
    try {
      await markMedicineTakenApi(eventId);
      loadData();
    } catch (e) {
      console.warn('Medicine error:', e);
    }
  };

  const handleSkipDose = async (eventId: string) => {
    try {
      await markMedicineSkipApi(eventId);
      loadData();
    } catch (e) {
      console.warn('Skip error:', e);
    }
  };

  const handleTriggerSos = async () => {
    try {
      await triggerSosApi(DEMO_ELDER_ID);
      setIsEmergencyTriggered(true);
      loadData();
    } catch (e) {
      console.warn('SOS error:', e);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentRoute) {
      case 'Medicines':
        return (
          <MedicinesScreen
            language={language}
            summary={elderData?.medicines || null}
            onTakeDose={handleTakeDose}
            onSkipDose={handleSkipDose}
            onRemindLater={() => setCurrentRoute('Home')}
            onBack={() => setCurrentRoute('Home')}
          />
        );
      case 'Health':
        return (
          <HealthScreen
            language={language}
            healthData={elderData?.health || null}
            onBack={() => setCurrentRoute('Home')}
          />
        );
      case 'Family':
        return (
          <FamilyScreen
            language={language}
            contacts={contacts}
            onCall={(c) => setCallingContact(c)}
            onBack={() => setCurrentRoute('Home')}
          />
        );
      case 'Government':
        return (
          <GovernmentScreen
            language={language}
            onBack={() => setCurrentRoute('Home')}
          />
        );
      default:
        return (
          <HomeScreen
            elderName={elderData?.elder?.full_name || 'Lakshmidhar Reddy'}
            language={language}
            voiceState={voiceState}
            transcript={transcript}
            aiResponse={aiResponse}
            pendingIntent={pendingIntent}
            onTalkPress={startListening}
            onConfirmIntent={confirmPendingAction}
            onNavigate={(route) => {
              if (route === 'Emergency') {
                setIsEmergencyTriggered(false);
                setIsEmergencyOpen(true);
              } else {
                setCurrentRoute(route);
              }
            }}
            onEmergencyPress={() => {
              setIsEmergencyTriggered(false);
              setIsEmergencyOpen(true);
            }}
            onCheckIn={handleCheckIn}
            checkInDone={elderData?.checkin?.status !== 'CHECK_IN_PENDING'}
            medicineTaken={elderData?.medicines?.taken_count ?? 3}
            medicineTotal={elderData?.medicines?.total_scheduled ?? 3}
            onSimulationTriggered={loadData}
            suggestedRoute={suggestedRoute}
            onSpeakGreeting={enableAssistantAndGreet}
            onEnableAssistant={enableAssistantAndGreet}
            onSendVoiceQuery={(query) => sendVoiceQuery(query)}
            onSpeakAgain={(text) => speakText(text, language)}
            onCallRahul={() => {
              setCallingContact({
                id: 'caregiver-rahul-01',
                name: 'Rahul (Son)',
                relationship: 'Son',
                phone: '9080503005',
                role: 'PRIMARY_CAREGIVER',
                notification_permission: true,
                emergency_contact: true,
                dashboard_access: true,
              });
            }}
            isContinuous={isContinuous}
            onToggleContinuous={() => setIsContinuous(!isContinuous)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Multilingual Selector: English, Tamil, Hindi, Telugu */}
      <LanguageSelector
        currentLanguage={language}
        onSelectLanguage={(lang) => setLanguage(lang)}
      />

      {/* Screen Router */}
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>

      {/* Emergency Modal */}
      <EmergencyModal
        language={language}
        isOpen={isEmergencyOpen}
        isTriggered={isEmergencyTriggered}
        onConfirmSos={handleTriggerSos}
        onCancel={() => {
          setIsEmergencyOpen(false);
          setIsEmergencyTriggered(false);
        }}
      />

      {/* Safe Simulated Calling Modal */}
      {callingContact && (
        <SafeCallModal
          contactName={callingContact.name}
          relationship={callingContact.relationship}
          phoneNumber={callingContact.phone}
          isOpen={true}
          onClose={() => setCallingContact(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
});
