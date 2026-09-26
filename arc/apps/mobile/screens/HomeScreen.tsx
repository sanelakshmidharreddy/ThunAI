import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LanguageCode } from '../../../shared/schemas/index.ts';
import { getTranslation } from '../i18n/index.ts';
import { VoiceButton } from '../components/VoiceButton.tsx';
import { CheckInCard } from '../components/CheckInCard.tsx';
import { ActionButtons } from '../components/ActionButtons.tsx';
import { TodayStatusBar } from '../components/TodayStatusBar.tsx';
import { DemoControlsDrawer } from '../components/DemoControlsDrawer.tsx';
import { VoiceState } from '../hooks/useVoiceCompanion.ts';
import { IntentResult } from '../../../shared/schemas/index.ts';

interface HomeScreenProps {
  elderName: string;
  language: LanguageCode;
  voiceState: VoiceState;
  transcript: string;
  aiResponse: string;
  pendingIntent: IntentResult | null;
  suggestedRoute?: string | null;
  onTalkPress: () => void;
  onConfirmIntent: (val: boolean) => void;
  onNavigate: (route: string) => void;
  onEmergencyPress: () => void;
  onCheckIn: (response: 'FINE' | 'NEED_HELP' | 'NOT_WELL' | 'URGENT_HELP') => void;
  checkInDone: boolean;
  medicineTaken: number;
  medicineTotal: number;
  onSimulationTriggered: () => void;
  onSpeakGreeting?: () => void;
  onSendVoiceQuery?: (query: string) => void;
  onSpeakAgain?: (text: string) => void;
  onEnableAssistant?: () => void;
  onCallRahul?: () => void;
  isContinuous?: boolean;
  onToggleContinuous?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  elderName,
  language,
  voiceState,
  transcript,
  aiResponse,
  pendingIntent,
  suggestedRoute,
  onTalkPress,
  onConfirmIntent,
  onNavigate,
  onEmergencyPress,
  onCheckIn,
  checkInDone,
  medicineTaken,
  medicineTotal,
  onSimulationTriggered,
  onSpeakGreeting,
  onSendVoiceQuery,
  onSpeakAgain,
  onEnableAssistant,
  onCallRahul,
  isContinuous = true,
  onToggleContinuous,
}) => {
  const t = getTranslation(language);
  const [customQuery, setCustomQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'health' | 'medicines' | 'family' | 'chit'>('all');

  // Friendly date display
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US', dateOptions);

  // Categorized voice questions tailored to elder's language
  const allQuestions = language === 'te' ? [
    { cat: 'health', label: '🩺 నా ఆరోగ్యం ఎలా ఉంది?', query: 'నా ఆరోగ్యం ఎలా ఉంది' },
    { cat: 'health', label: '🫀 రక్తపోటు తగ్గించే చిట్కాలు', query: 'బీపీ తగ్గాలంటే ఏమి చేయాలి' },
    { cat: 'health', label: '🥗 షుగర్ ఆహారపు నియమాలు', query: 'డయాబెటిస్ ఉన్నప్పుడు ఎలాంటి ఆహారం తినాలి' },
    { cat: 'health', label: '🚶 రోజూ నడక వల్ల లాభాలు', query: 'నడవడం వల్ల లాభాలు ఏమిటి' },
    { cat: 'health', label: '🦵 మోకాళ్ళ నొప్పులకు చిట్కాలు', query: 'మోకాళ్ళ నొప్పులకు చిట్కాలు' },
    { cat: 'medicines', label: '💊 మందులు చూపించు', query: 'మందులు చూపించు' },
    { cat: 'medicines', label: '⏰ ఈ రోజు ఏ మాత్రలు వేసుకోవాలి?', query: 'నా మందులు ఏమిటి' },
    { cat: 'family', label: '📞 రాహుల్ కి కాల్ చేయి', query: 'రాహుల్ కి కాల్ చేయి' },
    { cat: 'family', label: '👨 రాహుల్ వివరాలు', query: 'రాహుల్ ఎవరు' },
    { cat: 'family', label: '🏛️ ఆయుష్మాన్ భారత్ ₹5లక్షలు', query: 'ఆయుష్మాన్ భారత్ గురించి చెప్పు' },
    { cat: 'family', label: '☎️ ఎల్డర్ హెల్ప్‌లైన్ 14567', query: 'హెల్ప్‌లైన్ నంబర్' },
    { cat: 'chit', label: '💬 బాగున్నారా, ARC?', query: 'బాగున్నారా?' },
    { cat: 'chit', label: '😂 ఒక మంచి జోక్ చెప్పు', query: 'ఒక జోక్ చెప్పు' },
    { cat: 'chit', label: '🤖 ఆర్క్ అంటే ఏమిటి?', query: 'మీరు ఎవరు' },
    { cat: 'family', label: '🆘 అత్యవసర సహాయం', query: 'సహాయం' },
  ] : language === 'ta' ? [
    { cat: 'health', label: '🩺 என் உடல்நலம் எப்படி உள்ளது?', query: 'என் உடல்நலம் எப்படி உள்ளது' },
    { cat: 'health', label: '🫀 ரத்த அழுத்தம் குறைய வழிகள்', query: 'ரத்த அழுத்தம் குறைய வழிகள்' },
    { cat: 'health', label: '🥗 சர்க்கரை நோய் உணவு முறை', query: 'சர்க்கரை நோய் உணவு' },
    { cat: 'health', label: '🚶 நடைப்பயிற்சி நன்மைகள்', query: 'நடைப்பயிற்சி' },
    { cat: 'health', label: '🦵 மூட்டு வலி குறிப்புகள்', query: 'மூட்டு வலி' },
    { cat: 'medicines', label: '💊 மருந்துகள் காட்டு', query: 'மருந்துகள்' },
    { cat: 'family', label: '📞 ராகுலை அழை', query: 'ராகுல்' },
    { cat: 'family', label: '🏛️ ஆயுஷ்மான் பாரத் திட்டம்', query: 'ஆயுஷ்மான் பாரத்' },
    { cat: 'chit', label: '💬 எப்படி இருக்கிறீர்கள்?', query: 'நீங்கள் எப்படி இருக்கிறீர்கள்?' },
    { cat: 'chit', label: '😂 நகைச்சுவை சொல்லு', query: 'ஒரு நகைச்சுவை சொல்லு' },
    { cat: 'family', label: '🆘 அவசர உதவி', query: 'உதவி' },
  ] : language === 'hi' ? [
    { cat: 'health', label: '🩺 मेरी सेहत कैसी है?', query: 'मेरी सेहत कैसी है' },
    { cat: 'health', label: '🫀 बीपी कम करने के उपाय', query: 'बीपी कम करने के उपाय' },
    { cat: 'health', label: '🥗 डायबिटीज में क्या खाएं', query: 'डायबिटीज में क्या खाएं' },
    { cat: 'health', label: '🚶 टहलने के क्या फायदे हैं', query: 'टहलने के फायदे' },
    { cat: 'health', label: '🦵 घुटनों के दर्द के उपाय', query: 'घुटनों का दर्द' },
    { cat: 'medicines', label: '💊 दवाइयां दिखाओ', query: 'दवाइयां दिखाओ' },
    { cat: 'family', label: '📞 राहुल को कॉल करो', query: 'राहुल को कॉल करो' },
    { cat: 'family', label: '🏛️ आयुष्मान भारत ₹5 लाख योजना', query: 'आयुष्मान भारत योजना' },
    { cat: 'chit', label: '💬 आप कैसे हैं ARC?', query: 'आप कैसे हैं' },
    { cat: 'chit', label: '😂 एक चुटकला सुनाओ', query: 'एक चुटकला सुनाओ' },
    { cat: 'family', label: '🆘 आपातकालीन सहायता', query: 'मदद' },
  ] : [
    { cat: 'health', label: '🩺 How is my health?', query: 'How is my health' },
    { cat: 'health', label: '🫀 Tips to reduce BP', query: 'How to reduce blood pressure' },
    { cat: 'health', label: '🥗 Diet for diabetes', query: 'What should I eat for diabetes' },
    { cat: 'health', label: '🚶 Benefits of walking', query: 'Benefits of morning walking' },
    { cat: 'health', label: '🦵 Knee joint pain tips', query: 'What to do for knee joint pain' },
    { cat: 'medicines', label: '💊 Show Medicines', query: 'Show my medicines' },
    { cat: 'medicines', label: '⏰ What tablets today?', query: 'What medicines am I taking' },
    { cat: 'family', label: '📞 Call Rahul (9080503005)', query: 'Call Rahul' },
    { cat: 'family', label: '👨 Who is Rahul?', query: 'Who is Rahul' },
    { cat: 'family', label: '🏛️ Ayushman Bharat ₹5L', query: 'Tell me about Ayushman Bharat' },
    { cat: 'family', label: '☎️ Senior Helpline 14567', query: 'Senior helpline number' },
    { cat: 'chit', label: '💬 How are you, ARC?', query: 'How are you' },
    { cat: 'chit', label: '😂 Tell me a joke', query: 'Tell me a joke' },
    { cat: 'chit', label: '🤖 What is ARC?', query: 'What is ARC' },
    { cat: 'family', label: '🆘 Emergency Help', query: 'Emergency help' },
  ];

  const filteredQuestions = activeCategory === 'all'
    ? allQuestions
    : allQuestions.filter(q => q.cat === activeCategory);

  const handleCustomSubmit = () => {
    if (customQuery.trim() && onSendVoiceQuery) {
      onSendVoiceQuery(customQuery.trim());
      setCustomQuery('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* TOP: Greeting & Speaker Button */}
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {t.greeting ? t.greeting.replace('{name}', elderName) : `Good morning, ${elderName}`}
            </Text>
            <Text style={styles.dateText}>
              {t.datePrefix || 'Today is'} {formattedDate}
            </Text>
          </View>

          {/* Large Audio Speaker Button */}
          {onSpeakGreeting && (
            <TouchableOpacity
              style={styles.speakerBtn}
              onPress={onSpeakGreeting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Listen to voice greeting"
            >
              <Text style={{ fontSize: 28 }}>🔊</Text>
              <Text style={styles.speakerBtnLabel}>
                {language === 'te' ? 'వినండి' : language === 'ta' ? 'கேளுங்கள்' : language === 'hi' ? 'सुनिए' : 'Listen'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Banner */}
        <View style={styles.contactBadge}>
          <Text style={styles.contactBadgeText}>
            👤 {elderName} (8328287227) • 👨 Son: Rahul (9080503005)
          </Text>
        </View>
      </View>

      {/* CENTER: Large circular Talk To ARC Button & Spoken Dialog */}
      <VoiceButton
        voiceState={voiceState}
        transcript={transcript}
        aiResponse={aiResponse}
        pendingIntent={pendingIntent}
        suggestedRoute={suggestedRoute}
        onPress={onTalkPress}
        onConfirm={onConfirmIntent}
        onNavigate={onNavigate}
        onSpeakAgain={onSpeakAgain}
        onEnableAssistant={onEnableAssistant || onSpeakGreeting}
        onQuickQuery={onSendVoiceQuery}
        onCallRahul={onCallRahul}
        isContinuous={isContinuous}
        onToggleContinuous={onToggleContinuous}
        t={t}
        language={language}
      />

      {/* INTERACTIVE QUESTION BAR: Ask ARC Anything */}
      <View style={styles.askBarContainer}>
        <Text style={styles.askBarTitle}>
          {language === 'te' ? '💬 ARC ని ఏదైనా అడగండి (టైప్ చేయండి లేదా మాట్లాడండి):'
            : language === 'ta' ? '💬 ARC-யிடம் எதையும் கேளுங்கள்:'
            : language === 'hi' ? '💬 ARC से कुछ भी पूछें:'
            : '💬 Ask ARC Anything (Health, Medicines, Advice):'}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={customQuery}
            onChangeText={setCustomQuery}
            placeholder={
              language === 'te' ? 'ఉదా: నా ఆరోగ్యం ఎలా ఉంది? లేదా బీపీ తగ్గాలంటే...'
              : language === 'hi' ? 'जैसे: मेरी सेहत कैसी है? या बीपी के उपाय...'
              : 'e.g. How is my health? or Diabetes diet...'
            }
            placeholderTextColor="#94A3B8"
            onSubmitEditing={handleCustomSubmit}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.askBtn, !customQuery.trim() && styles.askBtnDisabled]}
            onPress={handleCustomSubmit}
            disabled={!customQuery.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.askBtnText}>
              {language === 'te' ? 'అడగండి 🚀' : language === 'hi' ? 'पूछें 🚀' : 'Ask 🚀'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* VOICE QUICK COMMAND CHIPS WITH CATEGORIES */}
      <View style={styles.suggestionsContainer}>
        <View style={styles.suggestionsHeader}>
          <Text style={styles.suggestionsTitle}>
            {language === 'te' ? '🗣️ శీఘ్ర ప్రశ్నలు (నొక్కండి):'
              : language === 'ta' ? '🗣️ விரைவு வினாக்கள்:'
              : language === 'hi' ? '🗣️ त्वरित प्रश्न (टैप करें):'
              : '🗣️ Quick Questions (Tap to ask & hear ARC):'}
          </Text>
        </View>

        {/* Category Filter Pills */}
        <View style={styles.catPillRow}>
          <TouchableOpacity
            style={[styles.catPill, activeCategory === 'all' && styles.catPillActive]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.catPillText, activeCategory === 'all' && styles.catPillTextActive]}>
              ⭐ All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.catPill, activeCategory === 'health' && styles.catPillActive]}
            onPress={() => setActiveCategory('health')}
          >
            <Text style={[styles.catPillText, activeCategory === 'health' && styles.catPillTextActive]}>
              ❤️ Health
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.catPill, activeCategory === 'medicines' && styles.catPillActive]}
            onPress={() => setActiveCategory('medicines')}
          >
            <Text style={[styles.catPillText, activeCategory === 'medicines' && styles.catPillTextActive]}>
              💊 Medicines
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.catPill, activeCategory === 'family' && styles.catPillActive]}
            onPress={() => setActiveCategory('family')}
          >
            <Text style={[styles.catPillText, activeCategory === 'family' && styles.catPillTextActive]}>
              👨 Family / Care
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.catPill, activeCategory === 'chit' && styles.catPillActive]}
            onPress={() => setActiveCategory('chit')}
          >
            <Text style={[styles.catPillText, activeCategory === 'chit' && styles.catPillTextActive]}>
              💬 Chit-Chat
            </Text>
          </TouchableOpacity>
        </View>

        {/* Questions Grid */}
        <View style={styles.chipGrid}>
          {filteredQuestions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionChip}
              onPress={() => onSendVoiceQuery && onSendVoiceQuery(item.query)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* DAILY CHECK-IN */}
      <CheckInCard
        onCheckIn={onCheckIn}
        completedToday={checkInDone}
        t={t}
      />

      {/* MAIN ACTIONS */}
      <ActionButtons
        onNavigate={onNavigate}
        onEmergencyPress={onEmergencyPress}
        t={t}
      />

      {/* BOTTOM: Today Status */}
      <TodayStatusBar
        medicineTaken={medicineTaken}
        medicineTotal={medicineTotal}
        checkInDone={checkInDone}
        t={t}
      />

      {/* HACKATHON DEMO MODE CONTROLS */}
      <DemoControlsDrawer
        elderId="elder-lakshmi-01"
        onSimulationTriggered={onSimulationTriggered}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 36,
  },
  topHeader: {
    paddingTop: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  speakerBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  speakerBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 2,
  },
  contactBadge: {
    marginTop: 10,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  askBarContainer: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  askBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  askBtn: {
    height: 48,
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  askBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  askBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  suggestionsContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  suggestionsHeader: {
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E',
  },
  catPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  catPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  catPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },
});
