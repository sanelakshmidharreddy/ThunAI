# ARC Demonstration Guide — Hackathon Judging Script

> **Scenario:** "Meet Lakshmi, a 72-year-old senior citizen living independently in Chennai."

---

## Act 1: The Morning Check-In

1. Open the **ARC Mobile App**.
2. Tap the language selector to switch between **English**, **தமிழ் (Tamil)**, **हिन्दी (Hindi)**, or **తెలుగు (Telugu)**. Notice the entire interface adapts respectfully.
3. The morning prompt greets:
   > *"Good morning Lakshmi. How are you feeling today?"*
4. Tap **"😊 I am fine"** (or press the giant circular 🎙️ **TALK TO ARC** button and say: *"I am fine"*).
5. ARC speaks aloud:
   > *"That's wonderful to hear! I've noted that you are doing well today."*
6. The status updates to **Check-in: Completed**.

---

## Act 2: Voice-First Medicine Reminder

1. Press the giant central **🎙️ TALK TO ARC** button.
2. Speak:
   > *"Remind me to take my tablet at eight tonight"*  
   *(Or in Tamil: "இரவு 8 மணிக்கு மாத்திரை நினைவூட்டு")*
3. Visual feedback transitions from **Listening...** to **Understanding...**
4. ARC responds with spoken audio and text:
   > *"I can set a medicine reminder for 8:00 PM. Would you like me to set it?"*
5. Large green **YES** and grey **NO** buttons appear on screen.
6. Tap **YES**.
7. ARC confirms:
   > *"Done. I will remind you at 8:00 PM."*

---

## Act 3: Medicine Adherence Flow

1. Open the **Medicines** tab or tap **Simulate Medicine Reminder** in the Demo Controls.
2. The dose card displays: *"Evening Calcium Tablet • 8:00 PM • Pending"*.
3. Tap the large green **[TAKEN]** button.
4. The dashboard updates immediately: **3 / 3 Taken** with a green adherence progress bar.

---

## Act 4: Caregiver Peace of Mind

1. Open the **ARC Caregiver Web Dashboard** at `http://localhost:3000`.
2. Notice the real-time status banner:
   > **🟢 Lakshmi (72 years old) — Doing Well**  
   > *All check-ins and medicines on track.*
3. View the **Recorded Vitals**:
   - ❤️ Heart Rate: **72 BPM**
   - 🩺 Blood Pressure: **124 / 78 mmHg**
   - 🩸 Blood Sugar: **108 mg/dL**
   - 🧪 Creatinine: **1.0 mg/dL**
4. Inspect the **7-Day Trend Chart** and **Upcoming Cardiology Appointment**.

---

## Act 5: Missed Medicine & Escalation

1. In the **Demo Controls**, tap **[Simulate Missed Medicine]**.
2. The Caregiver Dashboard immediately updates to:
   > **⚠️ Attention Needed: Missed 1 scheduled medicine. Please check in with Lakshmi.**
3. An alert is logged in the Caregiver notification feed.

---

## Act 6: Fall Detection & Emergency SOS

1. In the **Demo Controls**, tap **[Simulate Fall Event]** (or tap **🆘 EMERGENCY** on the Elder app).
2. The confirmation modal appears:
   > *"Do you need emergency help?"*
3. Tap **YES, CALL HELP**.
4. The Caregiver Dashboard triggers an immediate high-priority alert:
   > **🚨 POSSIBLE FALL DETECTED**  
   > *Simulated GPS Location: Mylapore, Chennai (13.0827, 80.2707)*
5. The caregiver clicks **Resolve Alert** after verifying safety.

---

## Act 7: Doctor Health Report Generation

1. On the Caregiver Dashboard, click **Download PDF Report**.
2. A clean, printable PDF report is generated containing elder demographics, adherence percentages, vitals tables, and clinic disclaimers.
