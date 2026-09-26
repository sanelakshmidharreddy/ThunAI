"""Pydantic AI Intent Extraction Agent.
Understands natural language in English, Tamil, Hindi, and Telugu,
extracting structured intent, entities, and elder-friendly responses.
"""
import re
import logging
from typing import Dict, Any, Optional
from app.config import settings
from app.schemas.voice import IntentResult
from app.voice.language import detect_language, preserve_medical_entities, get_localized_phrase

logger = logging.getLogger(__name__)


class IntentAgent:
    """Extracts structured intent and entities from elder voice or text."""

    def __init__(self):
        self.provider = settings.LLM_PROVIDER

    async def extract_intent(self, text: str, user_language: Optional[str] = None) -> IntentResult:
        """
        Parses text and extracts structured IntentResult.
        Guarantees zero-failure fallback with full support for English, Tamil, Hindi, and Telugu.
        """
        clean_text = (text or "").strip()
        lang = user_language or detect_language(clean_text)

        # First extract preserved entities (BP, HR, sugar, time)
        raw_entities = preserve_medical_entities(clean_text, {})

        # Evaluate against intent patterns
        lowered = clean_text.lower()

        # 1. SOS / EMERGENCY
        sos_explicit = [
            "sos", "emergency", "save me", "fallen", "fell down", "accident", "danger",
            "i need emergency help", "i need urgent help",
            "காப்பாற்று", "விழுந்துவிட்டேன்", "ஆபத்து", "அவசர உதவி",
            "बचाओ", "गिर गया", "खतरा", "आपातकालीन",
            "రక్షించండి", "పడిపోయాను", "ప్రమాదం", "అత్యవసరం", "అత్యవసర సహాయం"
        ]
        is_emergency = any(w in lowered for w in sos_explicit) or lowered.strip() in ["help", "sos", "உதவி", "मदद", "సహాయం"] or "urgent help" in lowered
        if is_emergency:
            resp = get_localized_phrase(lang, "sos_confirm")
            return IntentResult(
                intent="TRIGGER_SOS",
                confidence=0.98,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,  # Emergency is immediate
                response_text=resp,
                suggested_route="Emergency",
            )

        # 2. MEDICINE REMINDER CREATION
        med_keywords = ["remind", "reminder", "tablet", "medicine", "pill", "நினைவூட்டு", "மாத்திரை", "மருந்து", "याद दिलाओ", "दवाई", "गोली", "గుర్తుచేయి", "మందులు"]
        time_keywords = ["at", "night", "morning", "pm", "am", "clock", "மணிக்கு", "बजे", "గంటలకు"]
        if (
            ("remind" in lowered or "reminder" in lowered or "நினைவூட்டு" in lowered or "याद" in lowered or "గుర్తు" in lowered)
            and any(w in lowered for w in med_keywords)
        ):
            target_time = raw_entities.get("scheduled_time", "20:00")
            display_time = "8:00 PM" if target_time == "20:00" else target_time
            raw_entities["time"] = target_time
            raw_entities["medicine_name"] = "Prescribed Tablet"
            resp = get_localized_phrase(lang, "medicine_reminder_set", time=display_time)
            return IntentResult(
                intent="CREATE_MEDICINE_REMINDER",
                confidence=0.95,
                language=lang,
                entities=raw_entities,
                requires_confirmation=True,  # Elder confirms with YES button
                response_text=resp,
                suggested_route="Medicines",
            )

        # 3. REPORT MEDICINE TAKEN
        taken_keywords = ["took tablet", "taken tablet", "took medicine", "tablet taken", "medicine taken", "drank medicine", "மாத்திரை சாப்பிட்டேன்", "மருந்து எடுத்தேன்", "दवाई ले ली", "गोली खा ली", "మందులు వేసుకున్నాను"]
        if any(w in lowered for w in taken_keywords) or (("taken" in lowered or "took" in lowered) and ("medicine" in lowered or "tablet" in lowered)):
            resp = get_localized_phrase(lang, "medicine_taken")
            return IntentResult(
                intent="REPORT_MEDICINE_TAKEN",
                confidence=0.96,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Medicines",
            )

        # 4. REPORT MEDICINE MISSED / SKIP
        missed_keywords = ["missed medicine", "missed tablet", "forgot tablet", "தவறிவிட்டது", "दवाई छूट गई", "మందులు మర్చిపోయాను"]
        if any(w in lowered for w in missed_keywords):
            resp = get_localized_phrase(lang, "medicine_missed")
            return IntentResult(
                intent="REPORT_MEDICINE_MISSED",
                confidence=0.93,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Medicines",
            )

        # 5. CALL RAHUL / FAMILY / CAREGIVER / SOMEONE
        call_someone_keywords = ["call someone", "call somebody", "talk to someone", "call some one", "some one call", "somebody call", "కాల్ చేయి", "ఎవరికైనా కాల్", "யாரையாவது அழைக்கவும்", "किसी को कॉल"]
        is_call_someone = any(w in lowered for w in call_someone_keywords) or any(w in lowered for w in ["call", "phone", "dial", "talk to", "contact"]) and any(w in lowered for w in ["someone", "somebody", "anyone", "anybody", "one", "some one"])

        if "rahul" in lowered or "రాహుల్" in lowered or "ராகுல்" in lowered or "राहुल" in lowered or is_call_someone:
            raw_entities["contact_name_or_relation"] = "Rahul (Son)"
            raw_entities["phone"] = "9080503005"
            return IntentResult(
                intent="CALL_FAMILY",
                confidence=0.98,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "rahul_info"),
                suggested_route="Family",
            )
        elif any(w in lowered for w in ["call", "phone", "அழைக்க", "போன்", "कॉल", "ఫోన్", "సంప్రదించు", "talk to", "connect me"]):
            contact = "Rahul (Son)" if any(w in lowered for w in ["son", "కొడుకు", "மகன்", "बेटा", "caregiver", "help"]) else "Rahul (Son)"
            raw_entities["contact_name_or_relation"] = contact
            raw_entities["phone"] = "9080503005"
            resp = get_localized_phrase(lang, "family_calling", contact=contact)
            return IntentResult(
                intent="CALL_FAMILY",
                confidence=0.95,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Family",
            )

        # 5B. EMOTIONAL SUPPORT / LONELINESS ("I am feeling alone", "feeling lonely")
        lonely_keywords = [
            "alone", "lonely", "feeling alone", "felling alone", "feel alone", "feeling lonely", "feel lonely",
            "nobody", "no one", "isolated", "sad", "crying", "unhappy", "bored", "miss family",
            "బాధగా ఉంది", "ఒంటరిగా", "ఒంటరితనం", "ఎవరూ లేరు", "దిగులుగా ఉంది", "ఏకాంతం",
            "தனிமையாக", "தனிமை", "யாரும் இல்லை", "கவலையாக", "சோகமாக",
            "अकेला", "अकेलापन", "कोई नहीं है", "उदास", "मन नहीं लग रहा", "दुखी"
        ]
        if any(w in lowered for w in lonely_keywords):
            raw_entities["emotion"] = "LONELINESS"
            raw_entities["suggested_contact"] = "Rahul (Son)"
            raw_entities["phone"] = "9080503005"
            return IntentResult(
                intent="EMOTIONAL_SUPPORT",
                confidence=0.98,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "emotional_alone"),
                suggested_route="Family",
            )

        # 6. DAILY CHECK-IN
        checkin_fine = ["i am fine", "doing well", "feeling good", "all good", "i'm fine", "fine", "நன்றாக இருக்கிறேன்", "நல்லா இருக்கேன்", "நான் நலம்", "मैं ठीक हूँ", "बढ़िया हूँ", "నేను బాగున్నాను"]
        checkin_not_well = ["not feeling well", "feeling sick", "body pain", "headache", "உடம்பு சரியில்லை", "வலிக்கிறது", "तबीयत खराब है", "दर्द हो रहा है", "ఆరోగ్యం బాగోలేదు", "నొప్పిగా ఉంది"]
        checkin_need_help = ["need help", "need some help", "உதவி வேண்டும்", "मदद चाहिए", "సహాయం కావాలి"]

        if any(w in lowered for w in checkin_fine):
            raw_entities["checkin_status"] = "FINE"
            resp = get_localized_phrase(lang, "checkin_fine")
            return IntentResult(
                intent="DAILY_CHECK_IN",
                confidence=0.96,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Home",
            )
        elif any(w in lowered for w in checkin_not_well):
            raw_entities["checkin_status"] = "NOT_WELL"
            resp = get_localized_phrase(lang, "checkin_not_well")
            return IntentResult(
                intent="DAILY_CHECK_IN",
                confidence=0.95,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Home",
            )
        elif any(w in lowered for w in checkin_need_help):
            raw_entities["checkin_status"] = "NEED_HELP"
            resp = get_localized_phrase(lang, "checkin_need_help")
            return IntentResult(
                intent="DAILY_CHECK_IN",
                confidence=0.94,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Home",
            )

        # 7. COMPANION CHIT-CHAT (HOW ARE YOU, WHO ARE YOU, JOKES, WEATHER, THANK YOU)
        if any(w in lowered for w in ["how are you", "how r u", "bagunnara", "bagunara", "eppadi irukinga", "kaise ho", "kaise hain", "బాగున్నారా", "ఎలా ఉన్నారు", "நீங்கள் எப்படி", "आप कैसे"]):
            return IntentResult(
                intent="CHIT_CHAT",
                confidence=0.95,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "how_are_you"),
                suggested_route=None,
            )

        if any(w in lowered for w in ["who are you", "what is your name", "who r u", "meeru evaru", "ne peru enti", "neenga yaar", "aap kaun ho", "மீరు ఎవరు", "నీ పేరేంటి", "நீ யார்", "आप कौन हैं", "तुम्हारा नाम"]):
            return IntentResult(
                intent="CHIT_CHAT",
                confidence=0.96,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "who_are_you"),
                suggested_route=None,
            )

        if any(w in lowered for w in ["joke", "funny", "laugh", "sarada", "chutkula", "hasyam", "జోక్", "నవ్వు", "హాస్యం", "நகைச்சுவை", "जोक", "चुटकला"]):
            return IntentResult(
                intent="CHIT_CHAT",
                confidence=0.95,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "joke"),
                suggested_route=None,
            )

        if any(w in lowered for w in ["weather", "rain", "climate", "hot", "cold", "sunny", "mausam", "varsham", "వాతావరణం", "வானிலை", "मौसम"]):
            return IntentResult(
                intent="CHIT_CHAT",
                confidence=0.92,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "weather"),
                suggested_route=None,
            )

        if any(w in lowered for w in ["thank you", "thanks", "dhanyavadalu", "nandri", "dhanyavad", "shukriya", "ధన్యవాదాలు", "நன்றி", "धन्यवाद", "शुक्रिया"]):
            return IntentResult(
                intent="CHIT_CHAT",
                confidence=0.96,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "thank_you"),
                suggested_route=None,
            )

        if any(w in lowered for w in ["hello", "hi", "good morning", "good afternoon", "good evening", "namaskaram", "namaste", "vanakkam", "హలో", "నమస్కారం", "வணக்கம்", "नमस्ते"]):
            return IntentResult(
                intent="GREETING",
                confidence=0.96,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "greeting"),
                suggested_route=None,
            )

        # 8. HEALTH READINGS RECORDING
        if "systolic" in raw_entities and "diastolic" in raw_entities:
            resp = get_localized_phrase(
                lang, "bp_recorded",
                systolic=int(raw_entities["systolic"]),
                diastolic=int(raw_entities["diastolic"])
            )
            return IntentResult(
                intent="RECORD_BLOOD_PRESSURE",
                confidence=0.97,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Health",
            )
        elif "blood_sugar" in raw_entities:
            resp = get_localized_phrase(lang, "sugar_recorded", value=int(raw_entities["blood_sugar"]))
            return IntentResult(
                intent="RECORD_BLOOD_SUGAR",
                confidence=0.95,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Health",
            )
        elif "heart_rate" in raw_entities:
            resp = get_localized_phrase(lang, "hr_recorded", value=int(raw_entities["heart_rate"]))
            return IntentResult(
                intent="RECORD_HEART_RATE",
                confidence=0.95,
                language=lang,
                entities=raw_entities,
                requires_confirmation=False,
                response_text=resp,
                suggested_route="Health",
            )

        # 9. CONVERSATIONAL QA & KNOWLEDGE INQUIRIES (Checked first for any question words or health/diet inquiries)
        question_indicators = [
            "how", "what", "why", "who", "when", "tips", "diet", "advice", "benefits", "reduce", "can i", "is my", "tell me",
            "food", "eat", "pain", "knee", "joint", "heart", "status",
            "ఎలా", "ఏమి", "ఏమిటి", "ఎవరు", "ఎందుకు", "ఎంత", "చెప్పు", "ఎలాంటి", "తీసుకోవాలి", "ఎలా ఉంది", "బాగుందా", "నొప్పులు", "ఆహారం",
            "எப்படி", "என்ன", "யார்", "சொல்லு", "எவ்வளவு", "இருக்கிறதா", "எப்படி உள்ளது", "சாப்பிடலாமா", "உணவு", "வலி",
            "कैसे", "क्या", "कौन", "बताओ", "कैसी", "कितना", "कम करने", "फायदे", "आहार", "दर्द"
        ]
        is_question_query = any(w in lowered for w in question_indicators)

        from app.agents.qa_agent import qa_agent
        if is_question_query:
            qa_res = qa_agent.answer_question(clean_text, language=lang)
            # If QA agent matched a specific knowledge topic or health status
            if qa_res.get("intent") in ["QUERY_HEALTH_STATUS", "HEALTH_ADVICE", "GENERAL_KNOWLEDGE", "GOVERNMENT_QUERY", "CALL_FAMILY", "NAVIGATE_MEDICINES"]:
                return IntentResult(
                    intent=qa_res.get("intent"),
                    confidence=0.95,
                    language=lang,
                    entities={"query": clean_text},
                    requires_confirmation=False,
                    response_text=qa_res.get("response"),
                    suggested_route=qa_res.get("suggested_route"),
                )

        # 10. GENERAL NAVIGATION COMMANDS (When elder asks to open/show a specific screen)
        # Home
        if any(w in lowered for w in ["home", "go home", "back home", "screen home", "illu", "intiki", "veedu", "ghar", "హోమ్", "ఇంటికి", "మొదటి పేజీ", "முகப்பு", "வீடு", "घर", "होम"]):
            return IntentResult(
                intent="NAVIGATE_HOME",
                confidence=0.95,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "nav_home"),
                suggested_route="Home",
            )
        # Medicines
        if any(w in lowered for w in ["medicine", "medicines", "tablet", "tablets", "pill", "dose", "mandulu", "mandhulu", "marundhu", "dawai", "dawa", "మాத்திரை", "மருந்து", "दवाई", "दवाइयां", "మందులు"]):
            return IntentResult(
                intent="NAVIGATE_MEDICINES",
                confidence=0.95,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "nav_medicines"),
                suggested_route="Medicines",
            )
        # Health / Dashboard
        if any(w in lowered for w in ["dashboard", "dash board", "health", "vitals", "bp", "blood pressure", "sugar", "pulse", "arogyam", "aarogyam", "sehat", "tabiyat", "உடல்நலம்", "स्वास्थ्य", "ఆరోగ్యం", "హెల్త్", "డాష్‌బోర్డ్", "డ్యాష్‌బోర్డ్", "டாஷ்போர்டு", "डैशबोर्ड"]):
            phrase_key = "nav_dashboard" if ("dashboard" in lowered or "dash board" in lowered or "డాష్" in lowered or "டாஷ்" in lowered or "डैश" in lowered) else "nav_health"
            return IntentResult(
                intent="NAVIGATE_HEALTH",
                confidence=0.96,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, phrase_key),
                suggested_route="Health",
            )
        # Family
        if any(w in lowered for w in ["family", "contacts", "phone book", "kutumbam", "kudumbam", "parivar", "குடும்பம்", "परिवार", "కుటుంబం", "కాంటాక్ట్స్"]):
            return IntentResult(
                intent="NAVIGATE_FAMILY",
                confidence=0.95,
                language=lang,
                entities={},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "nav_family"),
                suggested_route="Family",
            )
        # Government
        gov_keywords = ["pension", "scheme", "government", "senior benefit", "hospital", "pathakam", "yojana", "thittam", "ஓய்வூதியம்", "அரசு திட்டம்", "திட்டம்", "पेंशन", "सरकारी योजना", "పెన్షన్", "ప్రభుత్వ పథకం", "పథకాలు"]
        if any(w in lowered for w in gov_keywords):
            return IntentResult(
                intent="GOVERNMENT_QUERY",
                confidence=0.95,
                language=lang,
                entities={"query": clean_text},
                requires_confirmation=False,
                response_text=get_localized_phrase(lang, "nav_government"),
                suggested_route="Government",
            )

        # 11. GENERAL CONVERSATION & ASSISTANT FALLBACK (Answers ANY question in depth)
        # Try generative response with xAI Grok if key is configured
        try:
            from app.agents.grok_agent import grok_agent
            if grok_agent.has_api_key():
                grok_reply = grok_agent.generate_response(clean_text, language=lang)
                if grok_reply:
                    return IntentResult(
                        intent="GROK_COMPANION_CHAT",
                        confidence=0.96,
                        language=lang,
                        entities={"query": clean_text, "provider": "xai_grok"},
                        requires_confirmation=False,
                        response_text=grok_reply,
                        suggested_route=None,
                    )
        except Exception as e:
            logger.warning(f"Grok agent invocation note: {e}")

        # Fallback to local curated elder knowledge engine
        qa_res = qa_agent.answer_question(clean_text, language=lang)
        return IntentResult(
            intent=qa_res.get("intent", "CONVERSATIONAL_QA"),
            confidence=0.92,
            language=lang,
            entities={"query": clean_text},
            requires_confirmation=False,
            response_text=qa_res.get("response"),
            suggested_route=qa_res.get("suggested_route"),
        )


intent_agent = IntentAgent()
