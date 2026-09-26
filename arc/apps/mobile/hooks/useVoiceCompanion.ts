import { useState, useCallback, useRef, useEffect } from 'react';
import { LanguageCode, IntentResult } from '../../../shared/schemas/index.ts';
import { interpretVoiceOrText } from '../services/api.ts';
import { ChatMessage } from '../components/SiriVoiceAssistantModal.tsx';

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
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const isAssistantOpenRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const shouldListenRef = useRef<boolean>(false);

  useEffect(() => {
    isAssistantOpenRef.current = isAssistantOpen;
  }, [isAssistantOpen]);

  const getTimeBasedGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (language === 'te') {
      if (hour >= 17) {
        return 'హలో, శుభ సాయంత్రం లక్ష్మీధర్ రెడ్డి గారు! నేను ARC, మీ వాయిస్ అసిస్టెంట్. నా మైక్రోఫోన్ ఆన్‌లో ఉంది, నేను వింటున్నాను. ఈ రోజు మీకు ఎలా సహాయపడాలి?';
      } else if (hour >= 12) {
        return 'హలో, శుభ మధ్యాహ్నం లక్ష్మీధర్ రెడ్డి గారు! నేను ARC, మీ వాయిస్ అసిస్టెంట్. నా మైక్రోఫోన్ ఆన్‌లో ఉంది, నేను వింటున్నాను. మీకు ఎలా సహాయపడాలి?';
      }
      return 'హలో, శుభోదయం లక్ష్మీధర్ రెడ్డి గారు! నేను ARC, మీ వాయిస్ అసిస్టెంట్. నా మైక్రోఫోన్ ఆన్‌లో ఉంది, నేను వింటున్నాను. మీకు ఎలా సహాయపడాలి?';
    } else if (language === 'ta') {
      if (hour >= 17) {
        return 'வணக்கம், மாலை வணக்கம் லக்ஷ்மிதர் ரெட்டி! நான் ARC, உங்கள் குரல் தோழன். மைக்ரோஃபோன் ஆன் செய்யப்பட்டுள்ளது, நான் கேட்கிறேன். இன்று உங்களுக்கு எவ்வாறு உதவட்டும்?';
      }
      return 'வணக்கம், காலை வணக்கம் லக்ஷ்மிதர் ரெட்டி! நான் ARC, உங்கள் குரல் தோழன். நான் கேட்கிறேன், உங்களுக்கு எவ்வாறு உதவட்டும்?';
    } else if (language === 'hi') {
      if (hour >= 17) {
        return 'नमस्ते, शुभ संध्या लक्ष्मीधर रेड्डी जी! मैं ARC हूँ, आपका वॉयस असिस्टेंट। मेरा माइक ऑन है और मैं सुन रहा हूँ। आज मैं आपकी क्या सहायता करूँ?';
      } else if (hour >= 12) {
        return 'नमस्ते, शुभ दोपहर लक्ष्मीधर रेड्डी जी! मैं ARC हूँ, आपका वॉयस असिस्टेंट। मेरा माइक ऑन है, आप क्या पूछना चाहते हैं?';
      }
      return 'नमस्ते, शुभ प्रभात लक्ष्मीधर रेड्डी जी! मैं ARC हूँ, आपका वॉयस असिस्टेंट। मेरा माइक ऑन है, आज मैं आपकी क्या सहायता करूँ?';
    }

    // Default English
    if (hour >= 17) {
      return 'Hello, good evening Lakshmidhar Reddy! I am ARC, your voice assistant. My microphone is on and I am listening. How can I assist you today?';
    } else if (hour >= 12) {
      return 'Hello, good afternoon Lakshmidhar Reddy! I am ARC, your voice assistant. My microphone is on and I am listening. How can I assist you today?';
    }
    return 'Hello, good morning Lakshmidhar Reddy! I am ARC, your voice assistant. My microphone is on and I am listening. How can I assist you today?';
  }, [language]);

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
          utterance.rate = 0.90; // Natural cadence for elder clarity
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
            // Once speaking finishes, immediately re-arm the mic if in assistant mode
            if (shouldListenRef.current || isAssistantOpenRef.current) {
              setTimeout(() => {
                startListening();
              }, 250);
            }
          };

          utterance.onerror = () => {
            isSpeakingRef.current = false;
            setVoiceState('idle');
            if (onEndCallback) onEndCallback();
            if (shouldListenRef.current || isAssistantOpenRef.current) {
              setTimeout(() => {
                startListening();
              }, 250);
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
    // If ARC is currently speaking, wait for speech to finish to avoid audio feedback
    if (isSpeakingRef.current) {
      return;
    }

    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      // Avoid duplicate starts
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

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
        if (text && text.trim()) {
          setTranscript(text);
          sendVoiceQuery(text.trim());
        }
      };

      recognition.onerror = (e: any) => {
        // Siri/Alexa behavior: Persistent mic does not shut down on silence/timeout
        if ((shouldListenRef.current || isAssistantOpenRef.current) && !isSpeakingRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
              setVoiceState('listening');
            } catch (err) {}
          }, 400);
        } else {
          setVoiceState('idle');
        }
      };

      recognition.onend = () => {
        // Siri/Alexa behavior: Automatically restart listening when silence occurs
        if ((shouldListenRef.current || isAssistantOpenRef.current) && !isSpeakingRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
              setVoiceState('listening');
            } catch (err) {}
          }, 250);
        } else {
          setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
        }
      };

      try {
        recognition.start();
        setVoiceState('listening');
      } catch (e) {
        setVoiceState('idle');
      }
    } else {
      setVoiceState('listening');
    }
  }, [language]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
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
        return;
      }

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: queryText,
        timestamp: now,
      };

      setChatHistory((prev) => [...prev, userMsg]);
      setTranscript(queryText);
      setVoiceState('processing');

      try {
        const res = await interpretVoiceOrText(elderId, queryText, language);
        const intentRes: IntentResult = res.intent_result;

        setAiResponse(intentRes.response_text);
        setSuggestedRoute(intentRes.suggested_route || null);

        const arcMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'arc',
          text: intentRes.response_text,
          timestamp: now,
        };
        setChatHistory((prev) => [...prev, arcMsg]);

        const isCallFamily =
          intentRes.intent === 'CALL_FAMILY' ||
          queryText.toLowerCase().includes('call someone') ||
          queryText.toLowerCase().includes('call rahul');

        const isNavHealth =
          intentRes.intent === 'NAVIGATE_HEALTH' ||
          queryText.toLowerCase().includes('dashboard') ||
          queryText.toLowerCase().includes('show dashboard');

        // Speak aloud, then re-activate continuous mic immediately upon completion
        speakText(intentRes.response_text, intentRes.language || language, () => {
          if (intentRes.suggested_route && onNavigate) {
            onNavigate(intentRes.suggested_route);
          } else if (isNavHealth && onNavigate) {
            onNavigate('Health');
          }

          if (isCallFamily && onCallRequested) {
            onCallRequested({
              name: 'Rahul (Son)',
              phone: '9080503005',
              relationship: 'Son',
            });
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
        const fallbackText =
          language === 'te'
            ? 'లక్ష్మీధర్ రెడ్డి గారు, నేను మీతోనే ఉన్నాను. దయచేసి చెప్పండి, నేను వింటున్నాను.'
            : language === 'hi'
            ? 'लक्ष्मीधर रेड्डी जी, मैं सुन रहा हूँ। कृपया कहिए।'
            : 'I am right here with you, Lakshmidhar Reddy. Please speak, I am listening.';

        setAiResponse(fallbackText);
        setChatHistory((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'arc',
            text: fallbackText,
            timestamp: now,
          },
        ]);
        speakText(fallbackText, language);
      }
    },
    [elderId, language, speakText, onNavigate, onCallRequested, onRefreshData]
  );

  /**
   * Opens Siri/Alexa mode, speaks the friendly time-of-day greeting to Lakshmidhar Reddy,
   * and keeps the microphone continuously active.
   */
  const openAssistantModal = useCallback(() => {
    setIsAssistantOpen(true);
    isAssistantOpenRef.current = true;
    shouldListenRef.current = true;

    const greetingText = getTimeBasedGreeting();
    setAiResponse(greetingText);
    setTranscript('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory([
      {
        id: `greet-${Date.now()}`,
        sender: 'arc',
        text: greetingText,
        timestamp: now,
      },
    ]);

    // Speak greeting, then immediately start persistent listening
    speakText(greetingText, language, () => {
      setTimeout(() => {
        startListening();
      }, 300);
    });
  }, [getTimeBasedGreeting, language, speakText, startListening]);

  const closeAssistantModal = useCallback(() => {
    setIsAssistantOpen(false);
    isAssistantOpenRef.current = false;
    shouldListenRef.current = false;
    stopListening();
  }, [stopListening]);

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
    isAssistantOpen,
    chatHistory,
    openAssistantModal,
    closeAssistantModal,
    startListening,
    stopListening,
    sendVoiceQuery,
    confirmPendingAction,
    speakText,
  };
}
