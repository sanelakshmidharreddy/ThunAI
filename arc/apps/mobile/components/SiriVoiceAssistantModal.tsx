import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { VoiceState } from '../hooks/useVoiceCompanion.ts';
import { LanguageCode } from '../../../shared/schemas/index.ts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'arc';
  text: string;
  timestamp: string;
}

interface SiriVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceState: VoiceState;
  transcript: string;
  aiResponse: string;
  chatHistory: ChatMessage[];
  language: LanguageCode;
  onSendQuery: (query: string) => void;
  onSpeakAgain: (text: string) => void;
  onCallRahul: () => void;
  onNavigateHealth: () => void;
}

export const SiriVoiceAssistantModal: React.FC<SiriVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  voiceState,
  transcript,
  aiResponse,
  chatHistory,
  language,
  onSendQuery,
  onSpeakAgain,
  onCallRahul,
  onNavigateHealth,
}) => {
  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isProcessing = voiceState === 'processing';

  // Animation values for Siri/Alexa pulse orb
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening || isSpeaking || isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: isSpeaking ? 600 : isListening ? 900 : 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: isSpeaking ? 600 : isListening ? 900 : 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, isSpeaking, isProcessing, pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isAlone =
    aiResponse &&
    (aiResponse.toLowerCase().includes('not alone') ||
      aiResponse.toLowerCase().includes('alone') ||
      aiResponse.toLowerCase().includes('ఒంటరిగా') ||
      aiResponse.toLowerCase().includes('తనిமை') ||
      aiResponse.toLowerCase().includes('अकेला'));

  const quickChips =
    language === 'te'
      ? [
          { label: '👋 హలో', q: 'హలో' },
          { label: '💔 ఒంటరిగా ఉంది', q: 'నాకు ఒంటరిగా ఉంది' },
          { label: '📊 డాష్‌బోర్డ్ చూపించు', q: 'డాష్‌బోర్డ్ చూపించు' },
          { label: '📞 రాహుల్ కి కాల్ చేయి', q: 'రాహుల్ కి కాల్ చేయి' },
          { label: '🦵 మోకాళ్ళ నొప్పులు', q: 'నడిచిన తర్వాత మోకాళ్ళ నొప్పులు ఉన్నాయి' },
          { label: '🩺 నా ఆరోగ్యం ఎలా ఉంది?', q: 'నా ఆరోగ్యం ఎలా ఉంది' },
          { label: '😂 ఒక జోక్ చెప్పు', q: 'ఒక జోక్ చెప్పు' },
        ]
      : language === 'ta'
      ? [
          { label: '👋 வணக்கம்', q: 'வணக்கம்' },
          { label: '💔 தனிமையாக உணர்கிறேன்', q: 'நான் தனிமையாக உணர்கிறேன்' },
          { label: '📊 டாஷ்போர்டு காட்டு', q: 'டாஷ்போர்டு காட்டு' },
          { label: '📞 ராகுலை அழை', q: 'ராகுலை அழைக்கவும்' },
          { label: '🩺 உடல்நலம் எப்படி?', q: 'என் உடல்நலம் எப்படி உள்ளது' },
          { label: '😂 நகைச்சுவை சொல்லு', q: 'ஒரு நகைச்சுவை சொல்லு' },
        ]
      : language === 'hi'
      ? [
          { label: '👋 नमस्ते', q: 'नमस्ते' },
          { label: '💔 अकेला लग रहा है', q: 'मुझे अकेला लग रहा है' },
          { label: '📊 डैशबोर्ड दिखाओ', q: 'डैशबोर्ड दिखाओ' },
          { label: '📞 राहुल को कॉल करो', q: 'राहुल को कॉल करो' },
          { label: '🦵 घुटनों में दर्द', q: 'घुटनों में दर्द के लिए क्या करें' },
          { label: '🩺 सेहत कैसी है?', q: 'मेरी सेहत कैसी है' },
          { label: '😂 एक जोक सुनाओ', q: 'एक चुटकला सुनाओ' },
        ]
      : [
          { label: '👋 Hello', q: 'Hello' },
          { label: '💔 I am feeling alone', q: 'I am feeling alone' },
          { label: '📊 Show dashboard', q: 'Show dashboard' },
          { label: '📞 Call someone', q: 'Call someone' },
          { label: '🦵 Knee pain after walking', q: 'I have knee pain after walking today' },
          { label: '🩺 How is my health?', q: 'How is my health today' },
          { label: '😂 Tell me a joke', q: 'Tell me a joke' },
        ];

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.liveIndicator}>
              <View style={[styles.liveDot, isListening && styles.liveDotActive]} />
              <Text style={styles.liveText}>
                {isListening
                  ? '🎙️ MIC ALWAYS ACTIVE • LISTENING'
                  : isSpeaking
                  ? '🔊 ARC SPEAKING'
                  : isProcessing
                  ? '⚡ GROQ AI REASONING'
                  : '🎙️ PERSISTENT VOICE MODE'}
              </Text>
            </View>
            <Text style={styles.title}>ARC Alexa / Siri Companion</Text>
            <Text style={styles.subtitle}>Lakshmidhar Reddy (+91 8328287227)</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        {/* Center: Siri / Alexa Glowing Pulsing Sphere */}
        <View style={styles.orbContainer}>
          <Animated.View
            style={[
              styles.outerGlow,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isListening
                  ? 'rgba(239, 68, 68, 0.25)'
                  : isSpeaking
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(20, 184, 166, 0.25)',
              },
            ]}
          />
          <Animated.View
            style={[
              styles.siriOrb,
              {
                transform: [{ rotate: spin }, { scale: pulseAnim }],
                borderColor: isListening ? '#F87171' : isSpeaking ? '#60A5FA' : '#2DD4BF',
              },
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text style={styles.orbEmoji}>
                {isSpeaking ? '🔊' : isListening ? '🎙️' : '✨'}
              </Text>
            )}
          </Animated.View>

          <Text style={styles.orbStatusText}>
            {isListening
              ? language === 'te'
                ? 'నేను వింటున్నాను... మాట్లాడండి'
                : 'Listening continuously... speak naturally'
              : isSpeaking
              ? language === 'te'
                ? 'ARC సమాధానం ఇస్తోంది...'
                : 'ARC is speaking aloud...'
              : isProcessing
              ? language === 'te'
                ? 'సమాధానం సిద్ధం చేస్తోంది...'
                : 'Thinking with Groq AI...'
              : 'Speak now — microphone is enabled'}
          </Text>
        </View>

        {/* Live Conversation Chat Transcript */}
        <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
          {chatHistory.length === 0 ? (
            <View style={styles.emptyStateBox}>
              <Text style={styles.emptyStateEmoji}>💬</Text>
              <Text style={styles.emptyStateTitle}>Speak your mind, Lakshmidhar Reddy</Text>
              <Text style={styles.emptyStateSub}>
                Ask about knee pain, health, loneliness, say "show dashboard", or ask to call Rahul.
                ARC's microphone is always open for you.
              </Text>
            </View>
          ) : (
            chatHistory.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.arcBubble,
                ]}
              >
                <View style={styles.bubbleHeader}>
                  <Text style={styles.senderLabel}>
                    {msg.sender === 'user' ? '🗣️ Lakshmidhar Reddy' : '🤖 ARC (Groq AI)'}
                  </Text>
                  <Text style={styles.msgTime}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{msg.text}</Text>

                {msg.sender === 'arc' && (
                  <TouchableOpacity
                    style={styles.inlineSpeakBtn}
                    onPress={() => onSpeakAgain(msg.text)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.inlineSpeakText}>🔊 Hear Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

          {/* Quick Emotional Support Card if loneliness detected */}
          {isAlone && (
            <View style={styles.lonelinessCard}>
              <Text style={styles.lonelinessTitle}>💙 We are right here with you</Text>
              <Text style={styles.lonelinessSub}>
                Your son Rahul (9080503005) cares for you deeply. Would you like to call him right now?
              </Text>
              <View style={styles.lonelinessActions}>
                <TouchableOpacity
                  style={styles.callRahulBtn}
                  onPress={onCallRahul}
                  activeOpacity={0.8}
                >
                  <Text style={styles.callRahulText}>📞 Connect to Rahul (9080503005)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Testing Chips Bar */}
        <View style={styles.footerChipsContainer}>
          <Text style={styles.footerChipsTitle}>⚡ Quick Voice Scenarios (Speak or Tap):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {quickChips.map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => onSendQuery(chip.q)}
                activeOpacity={0.75}
              >
                <Text style={styles.quickChipText}>{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031E1B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 45,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#115E59',
    backgroundColor: '#042F2C',
  },
  headerLeft: {
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveDotActive: {
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#5EEAD4',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: '#99F6E4',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#134E4A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2DD4BF',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#0F766E',
    backgroundColor: '#032522',
  },
  outerGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  siriOrb: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 10,
  },
  orbEmoji: {
    fontSize: 42,
  },
  orbStatusText: {
    color: '#CCFBF1',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 14,
    letterSpacing: 0.3,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSub: {
    color: '#99F6E4',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    maxWidth: '92%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F766E',
    borderBottomRightRadius: 4,
  },
  arcBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#042F2C',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    borderBottomLeftRadius: 4,
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderLabel: {
    color: '#5EEAD4',
    fontSize: 12,
    fontWeight: '800',
  },
  msgTime: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 12,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  inlineSpeakBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#115E59',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inlineSpeakText: {
    color: '#CCFBF1',
    fontSize: 12,
    fontWeight: '700',
  },
  lonelinessCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  lonelinessTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  lonelinessSub: {
    color: '#BFDBFE',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 20,
  },
  lonelinessActions: {
    flexDirection: 'row',
  },
  callRahulBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  callRahulText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  footerChipsContainer: {
    backgroundColor: '#042F2C',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#0F766E',
  },
  footerChipsTitle: {
    color: '#99F6E4',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chipsRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2DD4BF',
  },
  quickChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
