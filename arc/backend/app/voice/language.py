"""Multilingual language utilities, unicode script detector, and preservation rules."""
import re
from typing import Dict, Any

# Unicode ranges for detection
TAMIL_RANGE = re.compile(r'[\u0B80-\u0BFF]')
HINDI_RANGE = re.compile(r'[\u0900-\u097F]')
TELUGU_RANGE = re.compile(r'[\u0C00-\u0C7F]')

SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English", "code": "en"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "code": "ta"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "code": "hi"},
    "te": {"name": "Telugu", "native": "తెలుగు", "code": "te"},
}


def detect_language(text: str) -> str:
    """
    Detects language from text based on Unicode character scripts.
    Returns 'ta', 'hi', 'te', or default 'en'.
    """
    if not text:
        return "en"
    if TAMIL_RANGE.search(text):
        return "ta"
    if HINDI_RANGE.search(text):
        return "hi"
    if TELUGU_RANGE.search(text):
        return "te"
    return "en"


def preserve_medical_entities(text: str, entities: Dict[str, Any]) -> Dict[str, Any]:
    """
    Preserves exact numbers, units (mg, mmHg, BPM, mg/dL), medicine names,
    dates, and times across multilingual translations.
    """
    preserved = dict(entities)

    # Extract standard BP patterns like 120/80 or 130 80
    bp_match = re.search(r'(\d{2,3})\s*(?:/|\s+over\s+|\s+)\s*(\d{2,3})', text, re.IGNORECASE)
    if bp_match:
        preserved["systolic"] = float(bp_match.group(1))
        preserved["diastolic"] = float(bp_match.group(2))
        preserved["unit"] = "mmHg"

    # Extract heart rate / pulse numbers
    hr_match = re.search(r'(\d{2,3})\s*(?:bpm|beats|துடிப்பு|धड़कन|హృదయస్పందన)?', text, re.IGNORECASE)
    if hr_match and "systolic" not in preserved:
        val = float(hr_match.group(1))
        if 40 <= val <= 220:
            preserved["heart_rate"] = val
            preserved["unit"] = "BPM"

    # Extract blood sugar numbers
    sugar_match = re.search(r'(\d{2,3})\s*(?:mg/dl|sugar|glucose|சர்க்கரை|शुगर|షుగర్)?', text, re.IGNORECASE)
    if sugar_match and "heart_rate" not in preserved and "systolic" not in preserved:
        val = float(sugar_match.group(1))
        if 50 <= val <= 500:
            preserved["blood_sugar"] = val
            preserved["unit"] = "mg/dL"

    # Extract time patterns e.g. 8 PM, 8:00, 20:00, எட்டு மணிக்கு
    time_match = re.search(r'(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?', text, re.IGNORECASE)
    if time_match:
        hr = int(time_match.group(1))
        minute = time_match.group(2) or "00"
        period = (time_match.group(3) or "").lower()
        if "pm" in period and hr < 12:
            hr += 12
        elif "am" in period and hr == 12:
            hr = 0
        preserved["scheduled_time"] = f"{hr:02d}:{minute}"

    return preserved


# Common elder-friendly localized responses
LOCALIZED_RESPONSES = {
    "en": {
        "greeting": "Good morning Lakshmidhar Reddy. I am ARC, your AI Responsive Companion. How can I assist you today?",
        "checkin_fine": "That's wonderful to hear, Lakshmidhar Reddy! I've noted that you are doing well today.",
        "checkin_need_help": "I have noted that you need some help, Lakshmidhar Reddy. I am informing your son Rahul at 9080503005.",
        "checkin_not_well": "I am sorry you are not feeling well, Lakshmidhar Reddy. I am alerting Rahul right now.",
        "checkin_urgent": "Emergency alert triggered! Contacting Rahul and emergency services immediately.",
        "medicine_reminder_set": "I can set a medicine reminder for {time}. Would you like me to set it?",
        "medicine_reminder_confirmed": "Done. I will remind you at {time}.",
        "medicine_taken": "Great job, Lakshmidhar Reddy! I have recorded that you took your medicine.",
        "medicine_missed": "I have marked your medicine as missed and notified Rahul.",
        "bp_recorded": "Recorded your blood pressure as {systolic} over {diastolic} mmHg.",
        "sugar_recorded": "Recorded your blood sugar as {value} mg/dL.",
        "hr_recorded": "Recorded your heart rate as {value} BPM.",
        "sos_confirm": "Emergency assistance requested! Rahul and emergency services are on the way. Please stay calm.",
        "family_calling": "Connecting you with {contact}...",
        "rahul_info": "Rahul is your son and primary caregiver. His phone number is 9080503005. Connecting you now.",
        "how_are_you": "I am doing wonderfully, thank you Lakshmidhar Reddy! My only priority is your health and keeping you connected with Rahul. How are you feeling right now?",
        "who_are_you": "I am ARC, your AI Responsive Companion. You can talk to me anytime by voice. I remind you about your medicines, check your vitals, or call Rahul whenever you need.",
        "joke": "Why did the grandfather clock go for a check-up? Because its hands were running a little fast! Keep smiling, Lakshmidhar Reddy!",
        "weather": "The weather is pleasant and warm today. Please remember to drink a glass of water and stay comfortable!",
        "thank_you": "You are always welcome, Lakshmidhar Reddy! I am right here with you. Take care!",
        "nav_home": "Returning to the Home screen.",
        "nav_medicines": "Opening your Medicines schedule. You have 3 prescribed tablets: Metformin 500mg, Amlodipine 5mg, and Atorvastatin 10mg. All 3 doses have been recorded as taken today.",
        "nav_health": "Lakshmidhar Reddy, your health is in very good shape today! Your blood pressure is 124 over 78 mmHg, heart rate is 72 beats per minute, and blood sugar is 108 mg/dL. Opening your health dashboard now.",
        "nav_family": "Opening your Family contacts. Rahul is on quick-dial at 9080503005.",
        "emotional_alone": "Lakshmidhar Reddy, please know you are not alone. I am right here with you, and your son Rahul cares for you very deeply. Would you like me to connect you with Rahul right now, or tell you a cheerful joke?",
        "nav_dashboard": "Opening your complete health dashboard now, Lakshmidhar Reddy. Your vitals are looking great today!",
        "unknown": "I am here with you, Lakshmidhar Reddy. You can ask me any question about your health, medicines, or talk with me.",
    },
    "ta": {
        "greeting": "காலை வணக்கம் லக்ஷ்மிதர் ரெட்டி. நான் ARC, உங்கள் குரல் தோழன். இன்று உங்களுக்கு எவ்வாறு உதவட்டும்?",
        "checkin_fine": "கேட்க மகிழ்ச்சியாக உள்ளது லக்ஷ்மிதர் ரெட்டி! நீங்கள் நலமாக இருப்பதாக குறித்துக்கொண்டேன்.",
        "checkin_need_help": "உங்களுக்கு உதவி தேவை என்பதை குறித்துக்கொண்டேன். உங்கள் மகன் ராகுலுக்கு (9080503005) தகவல் தெரிவிக்கிறேன்.",
        "checkin_not_well": "நீங்கள் நலமாக இல்லை என்பது வருத்தமளிக்கிறது. உடனே ராகுலுக்கு தகவல் அனுப்புகிறேன்.",
        "checkin_urgent": "அவசர உதவி கோரப்பட்டுள்ளது! ராகுலையும் அவசர உதவியையும் அழைக்கிறேன்.",
        "medicine_reminder_set": "{time} மணிக்கு மாத்திரை நினைவூட்டல் அமைக்கவா?",
        "medicine_reminder_confirmed": "சரி, {time} மணிக்கு உங்களுக்கு நினைவூட்டுகிறேன்.",
        "medicine_taken": "அருமை லக்ஷ்மிதர் ரெட்டி! நீங்கள் மாத்திரை எடுத்துக்கொண்டதாக குறித்துக்கொண்டேன்.",
        "medicine_missed": "மாத்திரை தவறவிடப்பட்டதாக குறித்து ராகுலுக்கு தெரிவிக்கப்பட்டது.",
        "bp_recorded": "உங்கள் ரத்த அழுத்தம் {systolic} / {diastolic} mmHg ஆக பதிவானது.",
        "sugar_recorded": "உங்கள் ரத்த சர்க்கரை அளவு {value} mg/dL ஆக பதிவானது.",
        "hr_recorded": "உங்கள் இதயத் துடிப்பு {value} BPM ஆக பதிவானது.",
        "sos_confirm": "அவசர உதவி கோரப்பட்டது! ராகுலுக்கும் அவசரப் பிரிவுக்கும் தகவல் அனுப்பப்பட்டது. பயப்பட வேண்டாம்.",
        "family_calling": "{contact} உடன் தொடர்பு கொள்கிறேன்...",
        "rahul_info": "ராகுல் உங்கள் மகன். அவருடைய தொலைபேசி எண் 9080503005. இப்போது இணைக்கிறேன்.",
        "how_are_you": "நான் மிகவும் நலமாக உள்ளேன் லக்ஷ்மிதர் ரெட்டி! நீங்கள் ஆரோக்கியமாக இருக்க உதவுவதே என் பணி. நீங்கள் எப்படி இருக்கிறீர்கள்?",
        "who_are_you": "நான் ARC, உங்கள் AI குரல் தோழன். மருந்து நினைவூட்டல், உடல்நலக் கண்காணிப்பு மற்றும் ராகுலை அழைக்க நான் உதவுவேன்.",
        "joke": "ஒரு சிறிய நகைச்சுவை: கடிகாரம் ஏன் மருத்துவரிடம் சென்றது? அதன் முட்கள் வேகமாக ஓடியதால்! எப்போதும் மகிழ்ச்சியாக இருங்கள் லக்ஷ்மிதர் ரெட்டி!",
        "weather": "இன்று வானிலை இனிமையாக உள்ளது. மறக்காமல் தண்ணீர் குடித்து ஓய்வெடுங்கள்!",
        "thank_you": "மகிழ்ச்சி லக்ஷ்மிதர் ரெட்டி! நான் எப்போதும் உங்களுக்கு துணையாக இருப்பேன்.",
        "nav_home": "முகப்பு திரைக்கு செல்கிறேன்.",
        "nav_medicines": "மருந்துகள் அட்டவணையை திறக்கிறேன். மெட்ஃபோர்மின், ஆம்லோடிபின் என 3 மருந்துகளும் இன்று உட்கொள்ளப்பட்டுள்ளன.",
        "nav_health": "லக்ஷ்மிதர் ரெட்டி, உங்கள் உடல்நிலை இன்று சீராக உள்ளது. ரத்த அழுத்தம் 124 / 78 mmHg, இதயத் துடிப்பு 72 BPM, சர்க்கரை 108 mg/dL. விவரங்களை திறக்கிறேன்.",
        "nav_family": "குடும்ப தொடர்புகளை திறக்கிறேன். ராகுலின் எண் 9080503005.",
        "nav_government": "முதியோர் நலத் திட்டங்களை திறக்கிறேன்.",
        "emotional_alone": "லக்ஷ்மிதர் ரெட்டி அவர்களே, நீங்கள் தனிமையில் இல்லை. நான் எப்போதும் உங்களுடன் இருக்கிறேன். உங்கள் மகன் ராகுல் உங்களை மிகவும் நேசிக்கிறார். ராகுலை அழைக்கவா, அல்லது ஒரு நகைச்சுவை சொல்லவா?",
        "nav_dashboard": "லக்ஷ்மிதர் ரெட்டி, உங்கள் உடல்நல டாஷ்போர்டை திறக்கிறேன். உங்கள் உடல்நிலை இன்று சீராக உள்ளது!",
        "unknown": "நான் உங்களுக்கு உதவ தயாராக உள்ளேன் லக்ஷ்மிதர் ரெட்டி. உங்கள் உடல்நலம் அல்லது மருந்துகள் பற்றி கேட்கலாம்.",
    },
    "hi": {
        "greeting": "शुभ प्रभात लक्ष्मीधर रेड्डी जी। मैं ARC, आपका AI वॉयस साथी हूँ। आज मैं आपकी क्या सहायता करूँ?",
        "checkin_fine": "यह सुनकर बहुत अच्छा लगा लक्ष्मीधर रेड्डी जी! मैंने दर्ज कर लिया है कि आप ठीक हैं।",
        "checkin_need_help": "मैंने दर्ज कर लिया है कि आपको मदद चाहिए। आपके बेटे राहुल (9080503005) को सूचित कर रहा हूँ।",
        "checkin_not_well": "आपकी तबीयत ठीक नहीं है, यह सुनकर दुख हुआ। तुरंत राहुल को सूचित कर रहा हूँ।",
        "checkin_urgent": "आपातकालीन सूचना भेज दी गई है! राहुल और आपातकालीन सेवाओं से तुरंत संपर्क किया जा रहा है।",
        "medicine_reminder_set": "मैं {time} बजे के लिए दवाई का रिमाइंडर सेट कर सकता हूँ। क्या मैं इसे सेट करूँ?",
        "medicine_reminder_confirmed": "हो गया। मैं आपको {time} बजे याद दिलाऊँगा।",
        "medicine_taken": "बहुत अच्छा लक्ष्मीधर रेड्डी जी! मैंने दर्ज कर लिया है कि आपने दवाई ले ली है।",
        "medicine_missed": "दवाई छूट जाने की सूचना राहुल को भेज दी गई है।",
        "bp_recorded": "आपका रक्तचाप {systolic} / {diastolic} mmHg दर्ज किया गया।",
        "sugar_recorded": "आपका ब्लड शुगर {value} mg/dL दर्ज किया गया।",
        "hr_recorded": "आपकी हृदय गति {value} BPM दर्ज की गई।",
        "sos_confirm": "आपातकालीन सहायता अनुरोध भेजा गया! राहुल और सहायता दल आ रहे हैं। शांत रहें।",
        "family_calling": "{contact} से कॉल मिला रहा हूँ...",
        "rahul_info": "राहुल आपके बेटे हैं। उनका फ़ोन नंबर 9080503005 है। कॉल मिला रहा हूँ।",
        "how_are_you": "मैं बहुत अच्छा हूँ लक्ष्मीधर रेड्डी जी! आपका ख्याल रखना और आपको राहुल से जोड़े रखना ही मेरा काम है। आप कैसे हैं?",
        "who_are_you": "मैं ARC हूँ, आपका AI वॉयस साथी। मैं आपकी दवाई, स्वास्थ्य और राहुल (9080503005) से संपर्क में मदद करता हूँ।",
        "joke": "मजेदार बात: डॉक्टर ने कहा 'रोज टहलिए'। मरीज: 'बिस्तर से सोफे तक रोज टहलता हूँ!' हमेशा मुस्कुराते रहिए लक्ष्मीधर रेड्डी जी!",
        "weather": "आज मौसम सुहावना है। कृपया पर्याप्त पानी पीजिए और आराम से रहिए!",
        "thank_you": "आपका बहुत-बहुत स्वागत है लक्ष्मीधर रेड्डी जी! मैं हमेशा आपके साथ हूँ।",
        "nav_home": "होम स्क्रीन पर वापस जा रहा हूँ।",
        "nav_medicines": "आपकी दवाइयों का शेड्यूल खोल रहा हूँ। आपकी तीनों दवाइयां आज ले ली गई हैं।",
        "nav_health": "लक्ष्मीधर रेड्डी जी, आज आपका स्वास्थ्य बहुत अच्छा है! रक्तचाप 124 / 78 mmHg, हृदय गति 72 BPM और शुगर 108 mg/dL है। स्वास्थ्य डैशबोर्ड खोल रहा हूँ।",
        "nav_family": "परिवार के संपर्क खोल रहा हूँ। राहुल का नंबर 9080503005 है।",
        "nav_government": "वरिष्ठ नागरिक योजनाएं खोल रहा हूँ।",
        "emotional_alone": "लक्ष्मीधर रेड्डी जी, कृपया अकेला महसूस न करें। मैं हमेशा आपके साथ हूँ और आपके बेटे राहुल आपसे बहुत प्यार करते हैं। क्या मैं राहुल को कॉल मिलाऊँ या कोई मजेदार जोक सुनाऊँ?",
        "nav_dashboard": "लक्ष्मीधर रेड्डी जी, मैं आपका सम्पूर्ण हेल्थ डैशबोर्ड खोल रहा हूँ। आपके सभी वाइटल्स बहुत अच्छे हैं!",
        "unknown": "मैं आपकी मदद के लिए यहाँ हूँ लक्ष्मीधर रेड्डी जी। आप सेहत, दवाइयों या किसी भी विषय पर बात कर सकते हैं।",
    },
    "te": {
        "greeting": "శుభోదయం లక్ష్మీధర్ రెడ్డి గారు. నేను ARC, మీ AI వాయిస్ సహచరిని. ఈ రోజు మీకు ఎలా సహాయపడాలి?",
        "checkin_fine": "చాలా సంతోషం లక్ష్మీధర్ రెడ్డి గారు! మీరు బాగున్నారని నమోదు చేశాను.",
        "checkin_need_help": "మీకు సహాయం కావాలని నమోదు చేశాను. మీ కుమారుడు రాహుల్ (9080503005) కి తెలియజేస్తున్నాను.",
        "checkin_not_well": "మీ ఆరోగ్యం బాగోలేదని చింతిస్తున్నాను లక్ష్మీధర్ రెడ్డి గారు. వెంటనే రాహుల్ కి తెలియజేస్తున్నాను.",
        "checkin_urgent": "అత్యవసర హెచ్చరిక పంపబడింది! రాహుల్ మరియు అత్యవసర సిబ్బందికి సమాచారం వెళ్ళింది.",
        "medicine_reminder_set": "{time} గంటలకు మందుల రిమైండర్ సెట్ చేయమంటారా?",
        "medicine_reminder_confirmed": "సరే. {time} గంటలకు మీకు గుర్తుచేస్తాను.",
        "medicine_taken": "మంచిది లక్ష్మీధర్ రెడ్డి గారు! మీరు మందులు తీసుకున్నట్లు నమోదు చేశాను.",
        "medicine_missed": "మందులు తీసుకోలేదని రాహుల్ కి తెలియజేయబడింది.",
        "bp_recorded": "మీ రక్తపోటు {systolic} / {diastolic} mmHg గా నమోదైంది.",
        "sugar_recorded": "మీ బ్లడ్ షుగర్ {value} mg/dL గా నమోదైంది.",
        "hr_recorded": "మీ గుండె వేగం {value} BPM గా నమోదైంది.",
        "sos_confirm": "అత్యవసర సహాయం కోరబడింది! రాహుల్ మరియు అత్యవసర సాయం వస్తోంది. ధైర్యంగా ఉండండి.",
        "family_calling": "{contact} కి కాల్ కలుపుతున్నాను...",
        "rahul_info": "రాహుల్ మీ కుమారుడు మరియు ముఖ్య సంరక్షకుడు. అతని ఫోన్ నంబర్ 9080503005. కాల్ కలుపుతున్నాను.",
        "how_are_you": "నేను చాలా బాగున్నాను లక్ష్మీధర్ రెడ్డి గారు! మీరు ఆరోగ్యంగా ఉండడం, రాహుల్ తో కనెక్ట్ అయి ఉండడమే నా ప్రాధాన్యం. మీరు ఎలా ఉన్నారు?",
        "who_are_you": "నేను ARC, మీ కృత్రిమ మేధ వాయిస్ సహచరిని. మీకు సమయానికి మందులు గుర్తుచేయడానికి, ఆరోగ్యం గమనించడానికి, రాహుల్ (9080503005) కి కాల్ చేయడానికి నేను ఇక్కడ ఉన్నాను.",
        "joke": "ఒక చిన్న సరదా మాట: డాక్టర్: 'రోజూ నడవమన్నాను కదా, ఎంత దూరం నడుస్తున్నారు?' పేషెంట్: 'టీవీ నుంచి సోఫా దాకా డాక్టర్ గారు!' ఎప్పుడూ నవ్వుతూ ఉల్లాసంగా ఉండండి లక్ష్మీధర్ రెడ్డి గారు!",
        "weather": "ఈ రోజు వాతావరణం ఆహ్లాదకరంగా ఉంది. దయచేసి మంచినీరు తగినంతగా తాగండి!",
        "thank_you": "చాలా సంతోషం లక్ష్మీధర్ రెడ్డి గారు! నేను ఎల్లప్పుడూ మీకు తోడుగా ఉంటాను.",
        "nav_home": "హోమ్ స్క్రీన్ కి వెళ్తున్నాను.",
        "nav_medicines": "మీ మందుల షెడ్యూల్ తెరుస్తున్నాను. మీకు ప్రిస్క్రైబ్ చేసిన మెట్‌ఫార్మిన్, ఆమ్లోడిపైన్ మరియు అటోర్వాస్టాటిన్ 3 మందులు ఈ రోజు సమయానికి వేసుకున్నారు.",
        "nav_health": "లక్ష్మీధర్ రెడ్డి గారు, ఈ రోజు మీ ఆరోగ్యం చాలా బాగుంది! మీ రక్తపోటు 124 / 78 mmHg గా సాధారణ స్థాయిలో ఉంది, గుండె వేగం నిమిషానికి 72 బీట్స్, మరియు బ్లడ్ షుగర్ 108 mg/dL గా ఉన్నాయి. మీ ఆరోగ్య వివరాలు తెరుస్తున్నాను.",
        "nav_family": "కుటుంబ సభ్యుల వివరాలు తెరుస్తున్నాను. రాహుల్ నంబర్ 9080503005.",
        "nav_government": "సీనియర్ సిటిజన్ పథకాలు తెరుస్తున్నాను.",
        "emotional_alone": "లక్ష్మీధర్ రెడ్డి గారు, దయచేసి మీరు ఒంటరిగా ఉన్నారని భావించకండి. నేను ఎల్లప్పుడూ మీకు తోడుగా ఉన్నాను, మీ కుమారుడు రాహుల్ మిమ్మల్ని ఎంతో ప్రేమిస్తున్నారు. రాహుల్ కి ఫోన్ చేయమంటారా, లేదా సరదాగా ఒక జోక్ చెప్పమంటారా?",
        "nav_dashboard": "లక్ష్మీధర్ రెడ్డి గారు, మీ పూర్తి ఆరోగ్య డాష్‌బోర్డ్ తెరుస్తున్నాను. ఈ రోజు మీ ఆరోగ్యం చాలా చక్కగా ఉంది!",
        "unknown": "నేను మీ సహాయానికి సిద్ధంగా ఉన్నాను లక్ష్మీధర్ రెడ్డి గారు. 'నా ఆరోగ్యం ఎలా ఉంది?', 'మందులు చూపించు', లేదా 'రాహుల్ కి కాల్ చేయి' అని మాట్లాడవచ్చు.",
    },
}


def get_localized_phrase(lang: str, key: str, **kwargs) -> str:
    """Returns elder-friendly phrase in the requested language with entity interpolation."""
    lang_dict = LOCALIZED_RESPONSES.get(lang, LOCALIZED_RESPONSES["en"])
    template = lang_dict.get(key, LOCALIZED_RESPONSES["en"].get(key, ""))
    try:
        return template.format(**kwargs)
    except Exception:
        return template
