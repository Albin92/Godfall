# MEDICARE+

| Field               | Details                                    |
|---------------------|--------------------------------------------|
| **Problem Statement ID** | PS03HC                              |
| **Team Name**       | GODFALL                                    |
| **College Name**    | Shree Devi College of Information Science  |

---

## Problem Statement

Elderly individuals often struggle with managing multiple medications, tracking health vitals, and getting timely medical support — especially when living alone. Missed doses, unmonitored symptoms, and lack of proactive alerts can lead to serious health risks or medical emergencies.

There is a clear need for an accessible, intelligent, and proactive digital solution that empowers elderly users (and their caregivers) to manage day-to-day health independently and safely.

---

## Proposed Solution

**MEDICARE+** is a smart health management companion app designed specifically for elderly individuals. It provides:

- 💊 **Medication Reminders** – Personalised, recurring reminders with voice alerts for each medication dose.
- 📊 **Health Monitoring Dashboard** – Track vitals like blood pressure, blood sugar, heart rate, and weight over time.
- 🚨 **Emergency SOS** – One-tap emergency alert that shares the user's live location with registered caregivers or family members.
- 👴 **Caregiver Portal** – A secondary view for family members or caregivers to monitor health logs and medication adherence remotely.
- 🤖 **AI Health Assistant** – A conversational assistant (chatbot) that answers health-related queries, provides reminders, and flags anomalies in vitals.
- 📅 **Doctor Appointment Tracker** – Schedule and track upcoming medical appointments with integrated calendar reminders.

---

## Innovation & Creativity

- **Voice-first accessibility** — Large fonts, high contrast UI, and voice-guided interaction make it usable even for tech-averse elderly users.
- **Proactive anomaly detection** — Instead of just logging vitals, the app analyses trends and alerts caregivers if values deviate from normal ranges.
- **Offline-capable** — Core features like medication reminders and local health logs work without internet access to ensure reliability.
- **Dual-view design** — Separate, purpose-built interfaces for the elderly user and their caregiver/family member reduce friction and confusion.
- **Gamified adherence** — Medication streaks and achievement badges encourage consistent medication and health tracking habits.

---

## Tech Stack & Complexity

| Layer              | Technology                                |
|--------------------|-------------------------------------------|
| **Frontend**       | React Native (cross-platform iOS/Android) |
| **Backend**        | Node.js + Express.js                      |
| **Database**       | Firebase Firestore (real-time sync)       |
| **Authentication** | Firebase Auth                             |
| **AI Assistant**   | Google Gemini API                         |
| **Notifications**  | Firebase Cloud Messaging (FCM)            |
| **Location/Maps**  | Google Maps API                           |
| **Charts**         | Victory Native (health trend graphs)      |
| **State Management** | Redux Toolkit                           |

**Complexity highlights:**
- Real-time health data sync across caregiver and patient devices.
- ML-based anomaly detection on vitals using statistical thresholds.
- Scheduling engine for recurring, customizable medication reminders.
- Secure end-to-end encrypted caregiver-patient data sharing.

---

## Usability & Impact

**Target Users:**
- Elderly individuals (60+) managing chronic conditions or multiple medications.
- Family members and caregivers who monitor an elderly relative remotely.
- Healthcare providers who want to track patient adherence between visits.

**Real-World Value:**
- Reduces medication errors, which are a leading cause of hospitalisation in elderly populations.
- Provides caregivers peace of mind through remote monitoring and instant SOS alerts.
- Bridges the gap between clinic visits with continuous health tracking.
- Promotes independent living by giving elderly users control over their own healthcare.
- Scalable to nursing homes, assisted living facilities, and community health programmes.

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- npm or yarn
- React Native CLI
- Android Studio / Xcode (for emulator) or a physical device
- Firebase project configured

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Albin92/Godfall.git
cd Godfall

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Firebase config and API keys in .env

# 4. Start the Metro bundler
npm start

# 5. Run on Android
npm run android

# 6. Run on iOS (macOS only)
npm run ios
```

### Environment Variables

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

---

## Demo / Presentation Link

> 🎥 [Demo Video / Presentation](#) *(Link will be updated before submission)*

---

## Team Members

| Name | Role |
|------|------|
| *(Member 1)* | Frontend & UI/UX |
| *(Member 2)* | Backend & Database |
| *(Member 3)* | AI Integration & Testing |
| *(Member 4)* | DevOps & Documentation |

---

> *"Empowering independence. Ensuring safety. One reminder at a time."*
