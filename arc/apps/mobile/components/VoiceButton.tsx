import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { VoiceState } from '../hooks/useVoiceCompanion.ts';
import { IntentResult } from '../../../shared/schemas/index.ts';

interface VoiceButtonProps {
  voiceState: VoiceState;
  transcript: string;
  aiResponse: string;
  pendingIntent: IntentResult | null;
  suggestedRoute?: string | null;
  onPress: () => void;
  onConfirm: (val: boolean) => void;
  onNavigate?: (route: string) => void;
  onSpeakAgain?: (text: string) => void;
  onEnableAssistant?: () => void;
  onQuickQuery?: (query: string) => void;
  onCallRahul?: () => void;
  isContinuous?: boolean;
  onToggleContinuous?: () => void;
  t: Record<string, string>;
  language?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  voiceState,
  transcript,
  aiResponse,
  pendingIntent,
  suggestedRoute,
  onPress,
  onConfirm,
  onNavigate,
  onSpeakAgain,
  onEnableAssistant,
  onQuickQuery,
  onCallRahul,
  isContinuous = true,
  onToggleContinuous,
  t,
  language = 'en',
}) => {
  const isListening = voiceState === 'listening';
  const isProcessing = voiceState === 'processing';
  const isSpeaking = voiceState === 'speaking';

  const isHealthResponse =
    aiResponse &&
    (aiResponse.toLowerCase().includes('blood pressure') ||
      aiResponse.toLowerCase().includes('124') ||
      aiResponse.toLowerCase().includes('రక్తపోటు') ||
      aiResponse.toLowerCase().includes('ఆరోగ్యం') ||
      aiResponse.toLowerCase().includes('रक्तचाप') ||
      aiResponse.toLowerCase().includes('ரத்த அழுத்தம்') ||
      suggestedRoute === 'Health');

  const isEmotionalResponse =
    aiResponse &&
    (aiResponse.toLowerCase().includes('not alone') ||
      aiResponse.toLowerCase().includes('alone') ||
      aiResponse.toLowerCase().includes('ఒంటరిగా') ||
      aiResponse.toLowerCase().includes('தனிமை') ||
      aiResponse.toLowerCase().includes('अकेला') ||
      pendingIntent?.intent === 'EMOTIONAL_SUPPORT');

  const getRouteLabel = (route: string) => {
    switch (route) {
      case 'Health':
        return language === 'te'
          ? '❤️ ఆరోగ్యం డాష్‌బోర్డ్ తెరువు'
          : language === 'ta'
          ? '❤️ உடல்நலக் குறிப்பு காண்க'
          : language === 'hi'
          ? '❤️ स्वास्थ्य डैशबोर्ड खोलें'
          : '❤️ Open Health Dashboard';
      case 'Medicines':
        return language === 'te'
          ? '💊 మందుల వివరాలు తెరువు'
          : language === 'ta'
          ? '💊 மருந்துகள் அட்டவணை காண்க'
          : language === 'hi'
          ? '💊 दवाइयों का चार्ट खोलें'
          : '💊 Open Medicines Schedule';
      case 'Family':
        return language === 'te'
          ? '👨 రాహుల్ / కుటుంబ కాంటాక్ట్స్'
          : language === 'ta'
          ? '👨 குடும்பத் தொடர்புகள்'
          : language === 'hi'
          ? '👨 परिवार से संपर्क (राहुल)'
          : '👨 View Rahul (Family)';
      case 'Government':
        return language === 'te'
          ? '🏛️ వృద్ధుల సంక్షేమ పథకాలు'
          : language === 'ta'
          ? '🏛️ அரசு நலத்திட்டங்கள்'
          : language === 'hi'
          ? '🏛️ सरकारी योजनाएं देखें'
          : '🏛️ View Government Schemes';
      default:
        return 'View Details ➔';
    }
  };

  const quickPrompts =
    language === 'te'
      ? [
          { emoji: '👋', text: 'హలో', query: 'హలో' },
          { emoji: '💔', text: 'నాకు ఒంటరిగా ఉంది', query: 'నాకు ఒంటరిగా ఉంది' },
          { emoji: '📊', text: 'డాష్‌బోర్డ్ చూపించు', query: 'డాష్‌బోర్డ్ చూపించు' },
          { emoji: '📞', text: 'ఎవరికైనా కాల్ చేయి', query: 'ఎవరికైనా కాల్ చేయి' },
          { emoji: '🩺', text: 'నా ఆరోగ్యం ఎలా ఉంది?', query: 'నా ఆరోగ్యం ఎలా ఉంది' },
          { emoji: '😂', text: 'ఒక జోక్ చెప్పు', query: 'ఒక జోక్ చెప్పు' },
        ]
      : language === 'ta'
      ? [
          { emoji: '👋', text: 'வணக்கம்', query: 'வணக்கம்' },
          { emoji: '💔', text: 'தனிமையாக உணர்கிறேன்', query: 'நான் தனிமையாக உணர்கிறேன்' },
          { emoji: '📊', text: 'டாஷ்போர்டு காட்டு', query: 'டாஷ்போர்டு காட்டு' },
          { emoji: '📞', text: 'யாரையாவது அழைக்கவும்', query: 'யாரையாவது அழைக்கவும்' },
          { emoji: '🩺', text: 'என் உடல்நிலை எப்படி?', query: 'என் உடல்நலம் எப்படி உள்ளது' },
          { emoji: '😂', text: 'நகைச்சுவை சொல்லு', query: 'ஒரு நகைச்சுவை சொல்லு' },
        ]
      : language === 'hi'
      ? [
          { emoji: '👋', text: 'नमस्ते', query: 'नमस्ते' },
          { emoji: '💔', text: 'मुझे अकेला लग रहा है', query: 'मुझे अकेला लग रहा है' },
          { emoji: '📊', text: 'डैशबोर्ड दिखाओ', query: 'डैशबोर्ड दिखाओ' },
          { emoji: '📞', text: 'किसी को कॉल करो', query: 'किसी को कॉल करो' },
          { emoji: '🩺', text: 'मेरी सेहत कैसी है?', query: 'मेरी सेहत कैसी है' },
          { emoji: '😂', text: 'एक जोक सुनाओ', query: 'एक चुटकला सुनाओ' },
        ]
      : [
          { emoji: '👋', text: 'Hello', query: 'Hello' },
          { emoji: '💔', text: 'I am feeling alone', query: 'I am feeling alone' },
          { emoji: '📊', text: 'Show dashboard', query: 'Show dashboard' },
          { emoji: '📞', text: 'Call someone', query: 'Call someone' },
          { emoji: '🩺', text: 'How is my health?', query: 'How is my health' },
          { emoji: '😂', text: 'Tell me a joke', query: 'Tell me a joke' },
        ];

  return (
    <View style={styles.wrapper}>
      {/* Top Banner: Enable AI Voice Assistant Option */}
      <View style={styles.assistantHeaderRow}>
        {onEnableAssistant && (
          <TouchableOpacity
            style={styles.enableAssistantBtn}
            onPress={onEnableAssistant}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Enable AI Voice Assistance and Say Hello"
          >
            <Text style={styles.enableAssistantEmoji}>🎙️✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.enableAssistantTitle}>
                {language === 'te'
                  ? 'AI వాయిస్ అసిస్టెంట్ ఆన్ చేయండి'
                  : language === 'ta'
                  ? 'AI குரல் தோழனை இயக்கு'
                  : language === 'hi'
                  ? 'AI वॉयस साथी शुरू करें'
                  : 'Start AI Voice Assistant'}
              </Text>
              <Text style={styles.enableAssistantSub}>
                {language === 'te'
                  ? 'నొక్కండి: "హలో" అని పలకరించి వినడం మొదలుపెడుతుంది'
                  : 'Tap: Says "Hello" and listens continuously'}
              </Text>
            </View>
            <View style={styles.enablePill}>
              <Text style={styles.enablePillText}>START ▶</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Continuous Listening Status */}
        {onToggleContinuous && (
          <TouchableOpacity
            style={[styles.continuousBadge, isContinuous ? styles.continuousActive : styles.continuousInactive]}
            onPress={onToggleContinuous}
            activeOpacity={0.7}
          >
            <Text style={styles.continuousDot}>{isContinuous ? '🟢' : '⚪'}</Text>
            <Text style={styles.continuousText}>
              {isContinuous
                ? (language === 'te' ? 'నిరంతర సంభాషణ: ఆన్' : 'Continuous Listening: ON')
                : (language === 'te' ? 'సింగిల్ ట్యాప్ మోడ్' : 'Continuous: OFF')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Visual Feedback Transcript / Response */}
      {(transcript || aiResponse) && (
        <View style={styles.transcriptCard}>
          {/* User speech / query bubble */}
          {transcript ? (
            <View style={styles.userBubble}>
              <Text style={styles.bubbleLabel}>
                {language === 'te'
                  ? '🗣️ మీరు అడిగారు:'
                  : language === 'ta'
                  ? '🗣️ நீங்கள் கேட்டது:'
                  : language === 'hi'
                  ? '🗣️ आपने पूछा:'
                  : '🗣️ You asked:'}
              </Text>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            </View>
          ) : null}

          {/* AI Response Card */}
          {aiResponse ? (
            <View style={styles.aiBubble}>
              <View style={styles.aiHeaderRow}>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>🤖 ARC COMPANION</Text>
                </View>
                {isSpeaking ? (
                  <View style={styles.speakingIndicator}>
                    <Text style={styles.speakingIndicatorText}>🔊 Speaking aloud...</Text>
                  </View>
                ) : isListening ? (
                  <View style={styles.listeningIndicator}>
                    <Text style={styles.listeningIndicatorText}>👂 Listening to you...</Text>
                  </View>
                ) : onSpeakAgain ? (
                  <TouchableOpacity
                    style={styles.replayBtn}
                    onPress={() => onSpeakAgain(aiResponse)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Replay voice audio"
                  >
                    <Text style={styles.replayBtnText}>🔊 Replay Voice</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={styles.aiResponseText}>{aiResponse}</Text>

              {/* Special Emotional Support Card: Offering Immediate Connect to Rahul */}
              {isEmotionalResponse && (
                <View style={styles.emotionalSupportBox}>
                  <Text style={styles.emotionalSupportTitle}>
                    {language === 'te'
                      ? '💙 మీరు ఎప్పటికీ ఒంటరి కాదు'
                      : language === 'hi'
                      ? '💙 आप अकेले नहीं हैं'
                      : '💙 You Are Not Alone'}
                  </Text>
                  <Text style={styles.emotionalSupportSub}>
                    {language === 'te'
                      ? 'రాహుల్ (మీ కుమారుడు) కి వెంటనే ఫోన్ చేయమంటారా?'
                      : 'Rahul (Son) is always here for you at 9080503005.'}
                  </Text>
                  <View style={styles.emotionalActionsRow}>
                    {onCallRahul && (
                      <TouchableOpacity
                        style={styles.emotionalCallBtn}
                        onPress={onCallRahul}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.emotionalCallBtnText}>📞 Call Rahul (9080503005)</Text>
                      </TouchableOpacity>
                    )}
                    {onQuickQuery && (
                      <TouchableOpacity
                        style={styles.emotionalJokeBtn}
                        onPress={() => onQuickQuery('Tell me a joke')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.emotionalJokeBtnText}>😂 Tell Me a Joke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Embedded Live Health Vitals Snapshot if query was about health */}
              {isHealthResponse && (
                <View style={styles.vitalsSnapshot}>
                  <Text style={styles.vitalsTitle}>
                    {language === 'te'
                      ? '📊 ప్రత్యక్ష ఆరోగ్య నివేదిక:'
                      : language === 'hi'
                      ? '📊 आज की स्वास्थ्य रिपोर्ट:'
                      : '📊 Live Health Vitals Snapshot:'}
                  </Text>
                  <View style={styles.vitalsGrid}>
                    <View style={styles.vitalPill}>
                      <Text style={styles.vitalLabel}>🩸 BP</Text>
                      <Text style={styles.vitalVal}>124/78</Text>
                      <Text style={styles.vitalSub}>mmHg (Normal)</Text>
                    </View>
                    <View style={styles.vitalPill}>
                      <Text style={styles.vitalLabel}>❤️ Pulse</Text>
                      <Text style={styles.vitalVal}>72</Text>
                      <Text style={styles.vitalSub}>BPM (Steady)</Text>
                    </View>
                    <View style={styles.vitalPill}>
                      <Text style={styles.vitalLabel}>🍯 Sugar</Text>
                      <Text style={styles.vitalVal}>108</Text>
                      <Text style={styles.vitalSub}>mg/dL (Normal)</Text>
                    </View>
                    <View style={styles.vitalPill}>
                      <Text style={styles.vitalLabel}>💊 Meds</Text>
                      <Text style={styles.vitalVal}>3 / 3</Text>
                      <Text style={styles.vitalSub}>Taken (100%)</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* One-Tap Suggested Route Shortcut Button */}
              {suggestedRoute && onNavigate && (
                <TouchableOpacity
                  style={styles.routeActionBtn}
                  onPress={() => onNavigate(suggestedRoute)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.routeActionText}>{getRouteLabel(suggestedRoute)} ➔</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {/* Confirmation YES/NO Buttons */}
          {pendingIntent && (
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.confirmBtnYes]}
                onPress={() => onConfirm(true)}
              >
                <Text style={styles.confirmTextYes}>{t.confirmYes || 'YES'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.confirmBtnNo]}
                onPress={() => onConfirm(false)}
              >
                <Text style={styles.confirmTextNo}>{t.confirmNo || 'NO'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Large Circular Talk Button */}
      <TouchableOpacity
        style={[
          styles.circleBtn,
          isListening && styles.circleBtnListening,
          isSpeaking && styles.circleBtnSpeaking,
          isProcessing && styles.circleBtnProcessing,
        ]}
        onPress={onPress}
        disabled={isProcessing}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Talk to ARC digital companion"
      >
        {isProcessing ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Text style={styles.micEmoji}>
            {isSpeaking ? '🔊' : isListening ? '👂' : '🎙️'}
          </Text>
        )}
        <Text style={styles.btnTitle}>
          {isListening
            ? t.listening || 'Listening...'
            : isProcessing
            ? t.understanding || 'Understanding...'
            : isSpeaking
            ? language === 'te'
              ? 'మాట్లాడుతున్నాను...'
              : 'ARC Speaking...'
            : language === 'te'
            ? 'ARC తో మాట్లాడండి'
            : language === 'ta'
            ? 'ARC உடன் பேசுங்கள்'
            : language === 'hi'
            ? 'ARC से बात करें'
            : 'TALK TO ARC'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtext}>
        {isListening
          ? language === 'te'
            ? 'మాట్లాడండి, వింటున్నాను...'
            : t.tapToStop || 'Listening to your voice... speak naturally'
          : isSpeaking
          ? language === 'te'
            ? 'ARC సమాధానం ఇస్తోంది...'
            : 'ARC is speaking aloud to you...'
          : language === 'te'
          ? 'నొక్కండి మరియు మాట్లాడండి (నిరంతరం వింటుంది)'
          : 'Tap & speak, or tap below to test requested commands'}
      </Text>

      {/* QUICK COMMAND SCENARIO CHIPS (Requested interactive flow) */}
      <View style={styles.quickChipsWrapper}>
        <Text style={styles.quickChipsTitle}>
          {language === 'te'
            ? '⚡ మాట్లాడటానికి లేదా క్లిక్ చేయడానికి ఉదాహరణలు:'
            : '⚡ Try Voice Commands (Speak or Tap):'}
        </Text>
        <View style={styles.chipsRow}>
          {quickPrompts.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chipBtn}
              onPress={() => onQuickQuery && onQuickQuery(p.query)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{p.emoji}</Text>
              <Text style={styles.chipText}>{p.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  assistantHeaderRow: {
    width: '94%',
    maxWidth: 520,
    marginBottom: 12,
    gap: 8,
  },
  enableAssistantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#2DD4BF',
  },
  enableAssistantEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  enableAssistantTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  enableAssistantSub: {
    color: '#CCFBF1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  enablePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  enablePillText: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  continuousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  continuousActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  continuousInactive: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  continuousDot: {
    fontSize: 10,
    marginRight: 6,
  },
  continuousText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  transcriptCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#99F6E4',
    borderRadius: 20,
    padding: 16,
    width: '94%',
    maxWidth: 520,
    marginBottom: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  userBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  bubbleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  aiBubble: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiBadge: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  speakingIndicator: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  speakingIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  listeningIndicator: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  listeningIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B91C1C',
  },
  replayBtn: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  replayBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  aiResponseText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#134E4A',
    lineHeight: 25,
  },
  emotionalSupportBox: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
  },
  emotionalSupportTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E40AF',
    marginBottom: 4,
  },
  emotionalSupportSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 10,
  },
  emotionalActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionalCallBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionalCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emotionalJokeBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  emotionalJokeBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  vitalsSnapshot: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  vitalsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 8,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vitalPill: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  vitalVal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 2,
  },
  vitalSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  routeActionBtn: {
    marginTop: 12,
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  routeActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  confirmBtnYes: {
    backgroundColor: '#16A34A',
  },
  confirmBtnNo: {
    backgroundColor: '#E2E8F0',
  },
  confirmTextYes: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  confirmTextNo: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '800',
  },
  circleBtn: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 9,
    borderWidth: 5,
    borderColor: '#99F6E4',
  },
  circleBtnListening: {
    backgroundColor: '#E11D48',
    borderColor: '#FECDD3',
  },
  circleBtnSpeaking: {
    backgroundColor: '#2563EB',
    borderColor: '#BFDBFE',
  },
  circleBtnProcessing: {
    backgroundColor: '#D97706',
    borderColor: '#FDE68A',
  },
  micEmoji: {
    fontSize: 46,
    marginBottom: 4,
  },
  btnTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  subtext: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  quickChipsWrapper: {
    width: '94%',
    maxWidth: 520,
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
});
