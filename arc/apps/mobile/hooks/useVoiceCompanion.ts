import { useState, useCallback, useRef, useEffect } from 'react';
import { LanguageCode, IntentResult } from '../../../shared/schemas/index.ts';
import { interpretVoiceOrText } from '../services/api.ts';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceCompanionProps {
  elderId: string;
  language: LanguageCode;
  onNavigate?: (route: string) => void;
  onCallRequested?: (contact: { name: string; phone: string; relationship?: string }) => void;
  onRefreshData?: () => void;
}

export function useVoiceCompanion({
  elderId,
  language,
  onNavigate,
  onCallRequested,
  onRefreshData,
}: VoiceCompanionProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [pendingIntent, setPendingIntent] = useState<IntentResult | null>(null);
  const [suggestedRoute, setSuggestedRoute] = useState<string | null>(null);
  const [isContinuous, setIsContinuous] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const isContinuousRef = useRef<boolean>(true);
  const isSpeakingRef = useRef<boolean>(false);

  useEffect(() => {
    isContinuousRef.current = isContinuous;
  }, [isContinuous]);

  const speakText = useCallback(
    (text: string, lang: LanguageCode, onEndCallback?: () => void) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);

          const langMap: Record<LanguageCode, string> = {
            en: 'en-US',
            ta: 'ta-IN',
            hi: 'hi-IN',
            te: 'te-IN',
          };
          const targetLocale = langMap[lang] || 'en-US';
          utterance.lang = targetLocale;
          utterance.rate = 0.90; // Calibrated for elderly clarity
          utterance.pitch = 1.0;

          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const match = voices.find(
              (v) => v.lang === targetLocale || v.lang.startsWith(targetLocale.split('-')[0])
            );
            if (match) {
              utterance.voice = match;
            }
          }

          utterance.onstart = () => {
            isSpeakingRef.current = true;
            setVoiceState('speaking');
          };

          utterance.onend = () => {
            isSpeakingRef.current = false;
            setVoiceState('idle');
            if (onEndCallback) {
              onEndCallback();
            }
          };

          utterance.onerror = () => {
            isSpeakingRef.current = false;
            setVoiceState('idle');
            if (onEndCallback) {
              onEndCallback();
            }
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('SpeechSynthesis error:', err);
          isSpeakingRef.current = false;
          setVoiceState('idle');
          if (onEndCallback) onEndCallback();
        }
      } else {
        setVoiceState('idle');
        if (onEndCallback) onEndCallback();
      }
    },
    []
  );

  const startListening = useCallback(() => {
    if (isSpeakingRef.current) {
      return;
    }

    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
      };
      recognition.lang = langMap[language] || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        sendVoiceQuery(text);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e);
        setVoiceState('idle');
      };

      recognition.onend = () => {
        setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
      };

      try {
        recognition.start();
      } catch (e) {
        setVoiceState('idle');
      }
    } else {
      // Mock listening fallback for browsers without speech recognition
      setVoiceState('listening');
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setVoiceState('idle');
  }, []);

  const sendVoiceQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) {
        setVoiceState('idle');
        return;
      }

      try {
        setVoiceState('processing');
        setTranscript(queryText);
        const res = await interpretVoiceOrText(elderId, queryText, language);
        const intentRes: IntentResult = res.intent_result;

        setAiResponse(intentRes.response_text);
        setSuggestedRoute(intentRes.suggested_route || null);

        // Check if intent directs calling someone
        const isCallFamily =
          intentRes.intent === 'CALL_FAMILY' ||
          queryText.toLowerCase().includes('call someone') ||
          queryText.toLowerCase().includes('call rahul');

        const isNavHealth =
          intentRes.intent === 'NAVIGATE_HEALTH' ||
          queryText.toLowerCase().includes('dashboard') ||
          queryText.toLowerCase().includes('show dashboard');

        // Spoken response with continuous loop callback
        speakText(intentRes.response_text, intentRes.language || language, () => {
          // If pure navigation to Health/Medicines/Family
          if (intentRes.suggested_route && onNavigate) {
            onNavigate(intentRes.suggested_route);
          } else if (isNavHealth && onNavigate) {
            onNavigate('Health');
          }

          // If calling someone was requested, launch call modal after speaking
          if (isCallFamily && onCallRequested) {
            onCallRequested({
              name: 'Rahul (Son)',
              phone: '9080503005',
              relationship: 'Son',
            });
            return;
          }

          // In continuous mode, continue listening for the elder's next question!
          if (isContinuousRef.current) {
            setTimeout(() => {
              startListening();
            }, 500);
          }
        });

        if (intentRes.requires_confirmation) {
          setPendingIntent(intentRes);
        } else {
          setPendingIntent(null);
          if (onRefreshData) {
            onRefreshData();
          }
        }
      } catch (err: any) {
        const errMsg =
          language === 'te'
            ? 'నాతో మాట్లాడండి లక్ష్మీధర్ రెడ్డి గారు, నేను వింటున్నాను.'
            : language === 'hi'
            ? 'मैं सुन रहा हूँ लक्ष्मीधर रेड्डी जी, कृपया बोलिए।'
            : 'I am right here with you, Lakshmidhar Reddy. I am listening.';
        setAiResponse(errMsg);
        speakText(errMsg, language, () => {
          if (isContinuousRef.current) {
            setTimeout(startListening, 500);
          }
        });
      }
    },
    [elderId, language, speakText, onNavigate, onCallRequested, onRefreshData, startListening]
  );

  /**
   * Activates Voice Assistance, greets the elder with "Hello Lakshmidhar Reddy!",
   * and immediately starts listening for their reply.
   */
  const enableAssistantAndGreet = useCallback(() => {
    setIsContinuous(true);
    isContinuousRef.current = true;

    const greetings: Record<LanguageCode, string> = {
      en: 'Hello Lakshmidhar Reddy! I am listening. How are you feeling today?',
      te: 'హలో లక్ష్మీధర్ రెడ్డి గారు! నేను వింటున్నాను. ఈ రోజు మీకు ఎలా ఉంది?',
      ta: 'வணக்கம் லக்ஷ்மிதர் ரெட்டி! நான் கேட்கிறேன். இன்று நீங்கள் எப்படி இருக்கிறீர்கள்?',
      hi: 'नमस्ते लक्ष्मीधर रेड्डी जी! मैं सुन रहा हूँ। आज आप कैसा महसूस कर रहे हैं?',
    };

    const greetingText = greetings[language] || greetings.en;
    setAiResponse(greetingText);
    setTranscript('');

    speakText(greetingText, language, () => {
      // Automatically activate listening once ARC finishes speaking greeting
      setTimeout(() => {
        startListening();
      }, 400);
    });
  }, [language, speakText, startListening]);

  const confirmPendingAction = useCallback(
    async (confirmed: boolean) => {
      if (!pendingIntent) return;

      if (confirmed) {
        const confirmText =
          language === 'ta'
            ? 'சரி, மாத்திரை நினைவூட்டல் அமைக்கப்பட்டது.'
            : language === 'hi'
            ? 'हो गया। दवाई का रिमाइंडर सेट कर दिया गया है।'
            : language === 'te'
            ? 'సరే. మందుల రిమైండర్ సెట్ చేయబడింది.'
            : 'Done. I have set your medicine reminder.';
        setAiResponse(confirmText);
        speakText(confirmText, language);
        if (onRefreshData) onRefreshData();
      } else {
        const cancelText = language === 'ta' ? 'ரத்து செய்யப்பட்டது.' : 'Cancelled.';
        setAiResponse(cancelText);
        speakText(cancelText, language);
      }
      setPendingIntent(null);
    },
    [pendingIntent, language, speakText, onRefreshData]
  );

  return {
    voiceState,
    transcript,
    aiResponse,
    pendingIntent,
    suggestedRoute,
    isContinuous,
    setIsContinuous,
    enableAssistantAndGreet,
    startListening,
    stopListening,
    sendVoiceQuery,
    confirmPendingAction,
    speakText,
  };
}
