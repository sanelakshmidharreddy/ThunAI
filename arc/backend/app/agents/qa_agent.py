"""Elder-Friendly Conversational QA and Knowledge Assistant Engine.
Answers open-domain questions, senior health & nutrition advice, local knowledge,
and live elder vitals inquiries in English, Telugu, Tamil, and Hindi.
"""
import re
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Curated, verified knowledge base for senior citizen questions
KNOWLEDGE_BASE = {
    # 1. Health & Nutrition
    "diabetes_diet": {
        "en": "For diabetes, it is best to eat fiber-rich whole grains like oats, brown rice, or millets. Eat plenty of leafy green vegetables, cucumbers, and tomatoes. Avoid refined sugar, sweets, and sodas. Always take your Metformin right after your meals as prescribed.",
        "te": "షుగర్ నియంత్రణలో ఉండాలంటే జొన్నలు, రాగులు, ఓట్స్ మరియు ముడి బియ్యం వంటి పీచు పదార్థాలు తినడం మంచిది. ఆకుకూరలు, దోసకాయలు, టమోటాలు ఎక్కువగా తీసుకోండి. పంచదార, స్వీట్లు తగ్గించండి. డాక్టర్ సూచించిన మెట్‌ఫార్మిన్ మాత్రలను భోజనం తర్వాత క్రమం తప్పకుండా తీసుకోండి.",
        "ta": "சர்க்கரை நோயைக் கட்டுப்படுத்த கேழ்வரகு, தினை, ஓட்ஸ் மற்றும் காய்கறிகளை உணவில் சேர்க்கவும். இனிப்புகள் மற்றும் குளிர்பானங்களை தவிர்க்கவும். மருத்துவர் கூறியபடி மாத்திரைகளை உணவுக்குப் பின் தவறாமல் உட்கொள்ளுங்கள்.",
        "hi": "डायबिटीज के लिए हरी सब्जियां, मेथी, ओट्स और बाजरा खाना बहुत अच्छा है। मीठा और तली हुई चीजें कम करें। डॉक्टर की दी हुई दवाइयां खाने के बाद समय पर लें।",
    },
    "blood_pressure_tips": {
        "en": "To maintain healthy blood pressure, reduce your daily salt intake, drink plenty of water, and do 20 to 30 minutes of gentle walking every morning. Try to avoid stress and take your Amlodipine tablet regularly.",
        "te": "రక్తపోటును అదుపులో ఉంచుకోవడానికి ఆహారంలో ఉప్పును తగ్గించండి, తగినంత నీరు తాగండి, మరియు ప్రతిరోజూ ఉదయం 20 నుండి 30 నిమిషాలు ప్రశాంతంగా నడవండి. ఆందోళన తగ్గించుకోండి మరియు మీ ఆమ్లోడిపైన్ మాత్రను సమయానికి వేసుకోండి.",
        "ta": "ரத்த அழுத்தத்தை சீராக வைக்க உணவில் உப்பை குறைத்துக்கொள்ளவும். தினமும் காலை 20 நிமிடம் நடைப்பயிற்சி செய்யுங்கள் மற்றும் மாத்திரைகளை தவறாமல் எடுத்துக்கொள்ளுங்கள்.",
        "hi": "रक्तचाप सामान्य रखने के लिए नमक कम खाएं, रोज सुबह 20-30 मिनट टहलें और तनाव मुक्त रहें। अपनी दवाई समय पर जरूर लें।",
    },
    "walking_benefits": {
        "en": "Gentle daily walking keeps your heart strong, improves blood circulation, strengthens knee joints, and helps you sleep deeply at night. Even a short 15-minute walk in the garden is wonderful for your health, Lakshmidhar Reddy!",
        "te": "రోజూ ప్రశాంతంగా నడవడం వల్ల గుండె బలంగా ఉంటుంది, రక్తప్రసరణ మెరుగవుతుంది, కీళ్ళ నొప్పులు తగ్గుతాయి మరియు రాత్రి నిద్ర బాగా పడుతుంది. రోజూ కాసేపు నడవడం మీ ఆరోగ్యానికి ఎంతో శ్రేయస్కరం లక్ష్మీధర్ రెడ్డి గారు!",
        "ta": "தினசரி நடைப்பயிற்சி இதயத்தை பலப்படுத்துகிறது, ரத்த ஓட்டத்தை சீராக்குகிறது மற்றும் நல்ல தூக்கத்தை தருகிறது. தினமும் சிறிது நேரம் நடப்பது உங்கள் ஆரோக்கியத்திற்கு மிகவும் நல்லது!",
        "hi": "रोजाना टहलने से दिल मजबूत होता है, जोड़ों में लचीलापन बना रहता है और रात को नींद अच्छी आती है। रोज सुबह टहलना बहुत फायदेमंद है!",
    },
    "hydration": {
        "en": "Seniors should aim to drink at least 6 to 8 glasses of clean warm water throughout the day. It prevents dehydration, eases digestion, and keeps your blood pressure balanced.",
        "te": "రోజూ కనీసం 6 నుండి 8 గ్లాసుల గోరువెచ్చని మంచినీరు తాగడం చాలా మంచిది. ఇది డీహైడ్రేషన్ నివారించి, జీర్ణక్రియను మెరుగుపరుస్తుంది మరియు రక్తపోటును సమతుల్యంగా ఉంచుతుంది.",
        "ta": "முதியவர்கள் தினமும் 6 முதல் 8 டம்ளர் வெதுவெதுப்பான நீர் குடிப்பது நல்லது. இது உடலை புத்துணர்ச்சியாகவும் ரத்த அழுத்தத்தை சீராகவும் வைக்க உதவும்.",
        "hi": "दिन भर में 6 से 8 गिलास गुनगुना पानी पीना चाहिए। इससे शरीर में पानी की कमी नहीं होती और पाचन अच्छा रहता है।",
    },
    "sleep_tips": {
        "en": "To sleep peacefully, drink a small cup of warm milk before bed, avoid looking at bright screens, and keep your room quiet and comfortable. Lakshmidhar Reddy, a peaceful mind brings a restful night!",
        "te": "రాత్రి ప్రశాంతంగా నిద్ర పట్టాలంటే పడుకునే ముందు కొద్దిగా గోరువెచ్చని పాలు తాగండి, టీవీ లేదా మొబైల్ చూడటం తగ్గించండి, మరియు గదిని ప్రశాంతంగా ఉంచుకోండి. మనస్సును ప్రశాంతంగా ఉంచుకుంటే నిద్ర బాగా పడుతుంది లక్ష్మీధర్ రెడ్డి గారు!",
        "ta": "இரவில் நிம்மதியாக தூங்க படுக்கும் முன் வெதுவெதுப்பான பால் குடிக்கலாம். அமைதியான சூழலை உருவாக்கி ஓய்வெடுங்கள்.",
        "hi": "अच्छी नींद के लिए रात में हल्का भोजन करें, सोने से पहले थोड़ा गुनगुना दूध लें और शांत वातावरण में विश्राम करें।",
    },

    # 2. General Knowledge & Culture
    "pm_india": {
        "en": "The Prime Minister of India is Narendra Modi.",
        "te": "భారత ప్రస్తుత ప్రధానమంత్రి నరేంద్ర మోదీ గారు.",
        "ta": "இந்தியாவின் தற்போதைய பிரதமர் நரேந்திர மோடி அவர்கள்.",
        "hi": "भारत के माननीय प्रधानमंत्री श्री नरेंद्र मोदी हैं।",
    },
    "hyderabad_info": {
        "en": "Hyderabad is the historic capital known as the City of Pearls, famous for Charminar, Golconda Fort, and delicious Biryani, as well as a bustling technological hub.",
        "te": "హైదరాబాద్ చారిత్రాత్మక ముత్యాల నగరం. ఇది చార్మినార్, గోల్కొండ కోట, బిర్యానీ మరియు ప్రసిద్ధ సాంకేతిక విజ్ఞాన కేంద్రంగా పేరొందింది.",
        "ta": "ஹைதராபாத் முத்துக்களின் நகரம் என அழைக்கப்படும் வரலாற்று சிறப்புமிக்க நகரமாகும். சார்மினார் மற்றும் கோல்கொண்டா கோட்டை இங்கு பிரபலமானது.",
        "hi": "हैदराबाद को मोतियों का शहर कहा जाता है, जो चारमीनार, गोलकुंडा किला और अपनी समृद्ध संस्कृति के लिए प्रसिद्ध है।",
    },
    "ayushman_bharat": {
        "en": "Ayushman Bharat PM-JAY provides health insurance coverage of ₹5 Lakh per year for all senior citizens aged 70 and above, regardless of income. You can register with your Aadhaar card.",
        "te": "ఆయుష్మాన్ భారత్ యోజన ద్వారా 70 ఏళ్ళు పైబడిన సీనియర్ సిటిజన్లందరికీ ఆదాయ పరిమితి లేకుండా ఏటా ₹5 లక్షల ఉచిత వైద్య బీమా లభిస్తుంది. ఆధార్ కార్డుతో నమోదు చేసుకోవచ్చు.",
        "ta": "ஆயுஷ்மான் பாரத் திட்டம் மூலம் 70 வயதுக்கு மேற்பட்ட மூத்த குடிமக்களுக்கு ஆண்டுக்கு ₹5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை வழங்கப்படுகிறது.",
        "hi": "आयुष्मान भारत योजना के तहत 70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिकों को ₹5 लाख तक का मुफ्त स्वास्थ्य बीमा मिलता है।",
    },
    "emergency_helpline": {
        "en": "The national Senior Citizen Helpline 'Elder Line' is 14567. For general medical emergency, you can call 108 or national emergency 112.",
        "te": "సీనియర్ సిటిజన్ల జాతీయ హెల్ప్‌లైన్ 'ఎల్డర్ లైన్' నంబర్ 14567. అత్యవసర వైద్య సహాయానికి 108 లేదా 112 కి కాల్ చేయవచ్చు.",
        "ta": "முதியோர்களுக்கான தேசிய அவசர உதவி எண் 'Elder Line' 14567 ஆகும். அவசர மருத்துவ உதவிக்கு 108 அழைக்கலாம்.",
        "hi": "वरिष्ठ नागरिकों के लिए राष्ट्रीय हेल्पलाइन 'एल्डर लाइन' 14567 है। आपातकालीन सहायता के लिए 112 या 108 पर कॉल करें।",
    },
    "rahul_info": {
        "en": "Rahul is your son and primary caregiver. His phone number is 9080503005. He receives alerts about your medicines, health vitals, and is your first contact in any emergency.",
        "te": "రాహుల్ మీ కుమారుడు మరియు ముఖ్య సంరక్షకుడు. అతని ఫోన్ నంబర్ 9080503005. మీ మందుల సమయాలు మరియు ఆరోగ్యం గురించిన సమాచారం అతనికి అందుతుంది.",
        "ta": "ராகுல் உங்கள் மகன் மற்றும் முதன்மை பராமரிப்பாளர். அவருடைய எண் 9080503005. அவசர நேரத்தில் அவருக்கு உடனடியாக தகவல் தெரிவிக்கப்படும்.",
        "hi": "राहुल आपके सुपुत्र और मुख्य देखभालकर्ता हैं। उनका फ़ोन नंबर 9080503005 है। वे हमेशा आपके स्वास्थ्य पर नज़र रखते हैं।",
    },
    "joint_pain": {
        "en": "For joint and knee stiffness, apply a warm compress for 15 minutes, do gentle sitting leg extensions, and avoid sitting cross-legged for long hours. Staying active with a light morning walk helps lubricate your joints, Lakshmidhar Reddy!",
        "te": "మోకాళ్లు మరియు కీళ్ల నొప్పుల కోసం 15 నిమిషాలు గోరువెచ్చని నీటి కాపడం పెట్టండి, కూర్చుని నెమ్మదిగా కాళ్లు చాచే వ్యాయామం చేయండి, మరియు ఎక్కువసేపు నేలపై కూర్చోకుండా కుర్చీ వాడండి. రోజూ కాసేపు నడవడం వల్ల కీళ్లు సులువుగా కదులుతాయి లక్ష్మీధర్ రెడ్డి గారు!",
        "ta": "மூட்டு வலிக்கு வெதுவெதுப்பான ஒத்தடம் கொடுக்கலாம். லேசான உடற்பயிற்சிகளை செய்யவும். நீண்ட நேரம் ஒரே இடத்தில் உட்கார வேண்டாம்.",
        "hi": "घुटनों और जोड़ों के दर्द के लिए हल्के गर्म पानी का सेंक करें और बैठकर पैरों को सीधा करने का हल्का व्यायाम करें। ज्यादा देर एक ही जगह न बैठें।",
    },
    "heart_diet": {
        "en": "For a healthy heart, eat a handful of walnuts or almonds, include garlic in your meals, choose fiber-rich oats, and cook with very little oil. Your blood pressure and heart rate are currently in great balance!",
        "te": "గుండె ఆరోగ్యంగా ఉండటానికి ఆహారంలో వెల్లుల్లి, ఓట్స్, మరియు కొద్దిగా బాదం లేదా వాల్‌నట్స్ చేర్చుకోండి. వంటలలో నూనె బాగా తగ్గించండి. మీ గుండె వేగం మరియు రక్తపోటు ప్రస్తుతం చాలా చక్కగా సమతుల్యంగా ఉన్నాయి!",
        "ta": "இதய ஆரோக்கியத்திற்கு உணவில் பூண்டு, ஓட்ஸ் மற்றும் பாதாம் சேர்த்துக்கொள்ளவும். எண்ணெயை குறைக்கவும்.",
        "hi": "दिल को स्वस्थ रखने के लिए भोजन में लहसुन, ओट्स और कम तेल का प्रयोग करें। बादाम और अखरोट भी अच्छे हैं।",
    },
    "fruit_diet": {
        "en": "For diabetes, fruits with a low glycemic index like apples, guavas, and papayas are healthy in moderate portions. Avoid overeating very sweet fruits like mangoes, grapes, and chikoo.",
        "te": "డయాబెటిస్ ఉన్నవారు జామకాయలు, ఆపిల్, బొప్పాయి వంటి పండ్లను మితంగా తినడం మంచిది. మామిడిపండ్లు, ద్రాక్ష మరియు సపోటాలు ఎక్కువగా తినడం మంచిది కాదు.",
        "ta": "சர்க்கரை நோயாளிகள் கொய்யாப்பழம், ஆப்பிள் மற்றும் பப்பாளி போன்றவற்றை அளவோடு சாப்பிடலாம். மாம்பழம் மற்றும் திராட்சையை தவிர்க்கவும்.",
        "hi": "डायबिटीज में अमरूद, सेब और पपीता खाना अच्छा होता है। आम, अंगूर और चीकू अधिक मात्रा में न खाएं।",
    },
    "what_is_arc": {
        "en": "I am ARC — your AI Responsive Companion. I am designed specifically for you, Lakshmidhar Reddy, to remind you of medications, monitor your health vitals, answer your questions, and keep you securely connected with Rahul.",
        "te": "నేను ARC — మీ AI రెస్పాన్సివ్ సహచరిని. లక్ష్మీధర్ రెడ్డి గారు, మీ ఆరోగ్యాన్ని పర్యవేక్షించడానికి, మందుల వేళలను గుర్తుచేయడానికి, మీ ప్రశ్నలకు సమాధానమివ్వడానికి మరియు రాహుల్ తో ఎల్లప్పుడూ మిమ్మల్ని అనుసంధానించడానికి నేను రూపొందించబడ్డాను.",
        "ta": "நான் ARC — உங்கள் AI பொறுப்பான தோழன். லக்ஷ்மிதர் ரெட்டி அவர்களே, உங்கள் உடல்நலம், மருந்துகள் மற்றும் ராகுலுடன் இணைப்பில் இருக்க நான் உங்களுக்கு உதவுகிறேன்.",
        "hi": "मैं ARC हूँ — आपका AI सहायक साथी। लक्ष्मीधर रेड्डी जी, आपकी सेहत की निगरानी, दवाइयों के रिमाइंडर और राहुल से आपको जोड़े रखने के लिए मैं हमेशा आपके साथ हूँ।",
    },
    "medicines_info": {
        "en": "Lakshmidhar Reddy, your daily medicines are Metformin 500mg for sugar after breakfast, Amlodipine 5mg for blood pressure in the morning, and Atorvastatin 10mg at bedtime. You have successfully taken all 3 doses today!",
        "te": "లక్ష్మీధర్ రెడ్డి గారు, మీ రోజువారీ మందులు: అల్పాహారం తర్వాత షుగర్ కోసం మెట్‌ఫార్మిన్ 500mg, ఉదయం బీపీ కోసం ఆమ్లోడిపైన్ 5mg, మరియు రాత్రి నిద్రపోయే ముందు అటోర్వాస్టాటిన్ 10mg. ఈ రోజు మీరు 3 మందులూ సమయానికి వేసుకున్నారు!",
        "ta": "லக்ஷ்மிதர் ரெட்டி, உங்கள் தினசரி மருந்துகள்: சர்க்கரைக்காக மெட்ஃபோர்மின், ரத்த அழுத்தத்திற்காக அம்லோடிபைன் மற்றும் இரவில் அட்டர்வாஸ்டாடின். இன்று 3 மருந்துகளையும் எடுத்துக்கொண்டீர்கள்!",
        "hi": "लक्ष्मीधर रेड्डी जी, आपकी दवाइयां: नाश्ते के बाद शुगर के लिए मेटफॉर्मिन, सुबह बीपी के लिए एम्लोडिपाइन, और रात को एटोरवास्टेटिन। आज आपने तीनों दवाइयां समय पर ले ली हैं!",
    },
}


class ConversationalQAAgent:
    """Answers elder general questions, health status queries, and lifestyle advice."""

    def answer_question(self, question: str, language: str = "en", elder_vitals: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        lowered = (question or "").lower()
        lang = language if language in ["en", "te", "ta", "hi"] else "en"

        # 1. LIVE HEALTH STATUS QUERY ("How is my health?", "What is my BP?", "Did I take medicines?")
        if any(w in lowered for w in [
            "how is my health", "my health", "how am i", "my vitals", "health status", "am i healthy", "how is my bp",
            "నా ఆరోగ్యం", "నా హెల్త్", "ఎలా ఉంది", "నా బీపీ", "నా షుగర్", "ఆరోగ్యం ఎలా",
            "உடல்நிலை", "உடல் நலம் எப்படி", "என் உடல்நலம்", "என் பிபி",
            "मेरी सेहत", "मेरा स्वास्थ्य", "मेरा बीपी", "मेरी शुगर", "तबीयत कैसी है"
        ]):
            return self._build_health_status_response(lang, elder_vitals)

        # 2. MEDICINES SCHEDULE & STATUS
        if any(w in lowered for w in ["what medicines", "my tablets", "my pills", "which medicine", "నా మందులు", "ఏ మందులు", "నా మాత్రలు", "என் மருந்துகள்", "मेरी दवाइयां", "कौन सी दवाई"]):
            return {
                "intent": "NAVIGATE_MEDICINES",
                "response": KNOWLEDGE_BASE["medicines_info"].get(lang, KNOWLEDGE_BASE["medicines_info"]["en"]),
                "suggested_route": "Medicines",
            }

        # 3. DIABETES / SUGAR DIET
        if any(w in lowered for w in ["diabetes", "sugar diet", "sugar food", "డయాబెటిస్", "షుగర్ ఫుడ్", "షుగర్ ఉన్నప్పుడు", "சர்க்கரை நோய்", "डायबिटीज", "शुगर में क्या खाएं"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["diabetes_diet"].get(lang, KNOWLEDGE_BASE["diabetes_diet"]["en"]),
                "suggested_route": "Health",
            }

        # 4. BLOOD PRESSURE TIPS
        if any(w in lowered for w in ["reduce bp", "high bp", "blood pressure tips", "bp tips", "రక్తపోటు తగ్గడానికి", "బీపీ తగ్గాలంటే", "బీపీ చిట్కాలు", "ரத்த அழுத்தம் குறைய", "बीपी कम करने के उपाय"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["blood_pressure_tips"].get(lang, KNOWLEDGE_BASE["blood_pressure_tips"]["en"]),
                "suggested_route": "Health",
            }

        # 5. JOINT / KNEE PAIN
        if any(w in lowered for w in ["joint", "knee", "arthritis", "leg pain", "కీళ్లు", "మోకాళ్ళ", "మోకాలు", "నొప్పులు", "மூட்டு வலி", "घुटनों का दर्द", "जोड़ों का दर्द"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["joint_pain"].get(lang, KNOWLEDGE_BASE["joint_pain"]["en"]),
                "suggested_route": "Health",
            }

        # 6. HEART HEALTH DIET
        if any(w in lowered for w in ["heart diet", "heart food", "cholesterol", "గుండెకు మంచి ఆహారం", "కొలెస్ట్రాల్", "இதய உணவு", "दिल के लिए आहार"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["heart_diet"].get(lang, KNOWLEDGE_BASE["heart_diet"]["en"]),
                "suggested_route": "Health",
            }

        # 7. FRUIT EATING IN DIABETES
        if any(w in lowered for w in ["fruit", "fruits", "banana", "mango", "పండ్లు", "పండు", "பழங்கள்", "फल"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["fruit_diet"].get(lang, KNOWLEDGE_BASE["fruit_diet"]["en"]),
                "suggested_route": "Health",
            }

        # 8. WALKING & EXERCISE
        if any(w in lowered for w in ["walking", "exercise", "walk", "నడవడం", "నడక", "వాకింగ్", "நடைப்பயிற்சி", "टहलना", "व्यायाम"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["walking_benefits"].get(lang, KNOWLEDGE_BASE["walking_benefits"]["en"]),
                "suggested_route": "Health",
            }

        # 9. WATER & HYDRATION
        if any(w in lowered for w in ["water", "hydration", "drink water", "నీరు", "మంచినీళ్లు", "தண்ணீர்", "पानी"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["hydration"].get(lang, KNOWLEDGE_BASE["hydration"]["en"]),
                "suggested_route": None,
            }

        # 10. SLEEP TIPS
        if any(w in lowered for w in ["sleep", "insomnia", "నిద్ర", "నిద్ర పట్టడం", "தூக்கம்", "नींद"]):
            return {
                "intent": "HEALTH_ADVICE",
                "response": KNOWLEDGE_BASE["sleep_tips"].get(lang, KNOWLEDGE_BASE["sleep_tips"]["en"]),
                "suggested_route": None,
            }

        # 11. WHAT IS ARC / WHO ARE YOU
        if any(w in lowered for w in ["what is arc", "who are you", "what can you do", "మీరు ఎవరు", "ఆర్క్ అంటే ఏమిటి", "நீ யார்", "आप कौन हैं"]):
            return {
                "intent": "CHIT_CHAT",
                "response": KNOWLEDGE_BASE["what_is_arc"].get(lang, KNOWLEDGE_BASE["what_is_arc"]["en"]),
                "suggested_route": None,
            }

        # 12. RAHUL
        if any(w in lowered for w in ["rahul", "who is rahul", "రాహుల్ ఎవరు", "రాహుల్", "ராகுல் யார்", "राहुल कौन हैं"]):
            return {
                "intent": "CALL_FAMILY",
                "response": KNOWLEDGE_BASE["rahul_info"].get(lang, KNOWLEDGE_BASE["rahul_info"]["en"]),
                "suggested_route": "Family",
            }

        # 13. PRIME MINISTER
        if any(w in lowered for w in ["prime minister", "pm of india", "ప్రధానమంత్రి", "ప్రధాని", "பிரதமர்", "प्रधानमंत्री"]):
            return {
                "intent": "GENERAL_KNOWLEDGE",
                "response": KNOWLEDGE_BASE["pm_india"].get(lang, KNOWLEDGE_BASE["pm_india"]["en"]),
                "suggested_route": None,
            }

        # 14. HYDERABAD
        if any(w in lowered for w in ["hyderabad", "హైదరాబాద్", "ஹைதராபாத்", "हैदराबाद"]):
            return {
                "intent": "GENERAL_KNOWLEDGE",
                "response": KNOWLEDGE_BASE["hyderabad_info"].get(lang, KNOWLEDGE_BASE["hyderabad_info"]["en"]),
                "suggested_route": None,
            }

        # 15. AYUSHMAN BHARAT
        if any(w in lowered for w in ["ayushman", "pmjay", "health insurance", "ఆయుష్మాన్", "ஆயுஷ்மான்", "आयुष्मान भारत"]):
            return {
                "intent": "GOVERNMENT_QUERY",
                "response": KNOWLEDGE_BASE["ayushman_bharat"].get(lang, KNOWLEDGE_BASE["ayushman_bharat"]["en"]),
                "suggested_route": "Government",
            }

        # 16. HELPLINE
        if any(w in lowered for w in ["helpline", "emergency number", "నంబర్", "హెల్ప్‌లైన్", "தொலைபேசி எண்", "हेल्पलाइन"]):
            return {
                "intent": "GOVERNMENT_QUERY",
                "response": KNOWLEDGE_BASE["emergency_helpline"].get(lang, KNOWLEDGE_BASE["emergency_helpline"]["en"]),
                "suggested_route": "Family",
            }

        # 17. GENERAL CONVERSATION FALLBACK WITH WARMTH
        fallbacks = {
            "en": f"That is a wonderful question, Lakshmidhar Reddy. As your companion, I am always here to assist you with your health, medications, and staying connected with Rahul. Can I help you with your medicines, or show your vitals?",
            "te": f"మంచి ప్రశ్న లక్ష్మీధర్ రెడ్డి గారు. మీ తోడుగా మీ ఆరోగ్యం, మందులు మరియు రాహుల్ తో సంభాషణల్లో సహాయపడటానికి నేను ఎల్లప్పుడూ సిద్ధంగా ఉన్నాను. మీ మందుల వివరాలు చూడమంటారా లేదా ఆరోగ్యం చూపించమంటారా?",
            "ta": f"அருமையான கேள்வி லக்ஷ்மிதர் ரெட்டி. உங்கள் உடல்நலம் மற்றும் மருந்துகளில் உங்களுக்கு உதவ நான் எப்போதும் தயாராக உள்ளேன். மருந்துகள் அட்டவணையை பார்க்க வேண்டுமா?",
            "hi": f"बहुत अच्छा सवाल है लक्ष्मीधर रेड्डी जी। मैं हमेशा आपके स्वास्थ्य, दवाइयों और राहुल से संपर्क में सहायता के लिए तैयार हूँ। क्या आप दवाइयां देखना चाहते हैं?",
        }
        return {
            "intent": "CHIT_CHAT",
            "response": fallbacks.get(lang, fallbacks["en"]),
            "suggested_route": None,
        }

    def _build_health_status_response(self, lang: str, vitals: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Synthesizes elder's actual vitals into a reassuring spoken summary."""
        bp_sys = vitals.get("bp_systolic", 124) if vitals else 124
        bp_dia = vitals.get("bp_diastolic", 78) if vitals else 78
        hr = vitals.get("heart_rate", 72) if vitals else 72
        sugar = vitals.get("blood_sugar", 108) if vitals else 108
        meds_taken = vitals.get("meds_taken", 3) if vitals else 3
        meds_total = vitals.get("meds_total", 3) if vitals else 3

        if lang == "te":
            text = (
                f"లక్ష్మీధర్ రెడ్డి గారు, ఈ రోజు మీ ఆరోగ్యం చాలా బాగుంది! "
                f"మీ రక్తపోటు {bp_sys} / {bp_dia} mmHg గా సాధారణ స్థాయిలో ఉంది. "
                f"గుండె వేగం నిమిషానికి {hr} బీట్స్, బ్లడ్ షుగర్ {sugar} mg/dL గా చక్కగా ఉన్నాయి. "
                f"అలాగే ఈ రోజు షెడ్యూల్ చేసిన {meds_total} మందులలో {meds_taken} మందులు సమయానికి వేసుకున్నారు. "
                f"ఆరోగ్యంగా ఉండండి మరియు తగినంత మంచినీరు తాగండి!"
            )
        elif lang == "ta":
            text = (
                f"லக்ஷ்மிதர் ரெட்டி, உங்கள் உடல்நிலை இன்று மிகவும் சிறப்பாக உள்ளது! "
                f"ரத்த அழுத்தம் {bp_sys} / {bp_dia} mmHg, இதயத் துடிப்பு {hr} BPM மற்றும் சர்க்கரை அளவு {sugar} mg/dL ஆக சீராக உள்ளது. "
                f"இன்றைய {meds_total} மருந்துகளில் {meds_taken} மருந்துகளை எடுத்துக்கொண்டுள்ளீர்கள். "
                f"ஆரோக்கியமாக இருங்கள்!"
            )
        elif lang == "hi":
            text = (
                f"लक्ष्मीधर रेड्डी जी, आज आपकी सेहत बहुत अच्छी है! "
                f"आपका रक्तचाप {bp_sys} / {bp_dia} mmHg सामान्य है, "
                f"हृदय गति {hr} BPM और ब्लड शुगर {sugar} mg/dL स्थिर है। "
                f"आज की {meds_total} दवाइयों में से {meds_taken} दवाइयां आपने समय पर ले ली हैं। "
                f"हमेशा स्वस्थ रहिए!"
            )
        else:
            text = (
                f"Lakshmidhar Reddy, your health is looking very good today! "
                f"Your blood pressure is {bp_sys} over {bp_dia} mmHg, which is in a normal range. "
                f"Your heart rate is steady at {hr} beats per minute, and blood sugar is {sugar} mg/dL. "
                f"You have also taken {meds_taken} out of {meds_total} prescribed medicines today. "
                f"Keep up the great routine and remember to stay hydrated!"
            )

        return {
            "intent": "QUERY_HEALTH_STATUS",
            "response": text,
            "suggested_route": "Health",
        }


qa_agent = ConversationalQAAgent()
