# Travel Saathi 🌍✈️

Travel Saathi is a modern, AI-powered travel companion and planner app built with **React Native** and **Expo**. Designed with a beautiful, calming UI and rich interactive elements, Travel Saathi helps you explore the world, document your journeys, and earn rewards along the way.

## ✨ Key Features

- 🤖 **Live AI Travel Planner**: Powered by the **Google Gemini API**, you can search for any destination in the world and instantly generate dynamic travel summaries, top attractions, vibe checks, and budget recommendations.
- 📖 **Travel Diary**: Document your trips, track your budget, and upload photos to create lasting memories.
- 🎁 **Gamified Rewards System**: Earn "Travel Points" by writing in your diary and logging photos. Redeem your points for exciting (mock) rewards like flight vouchers, hotel discounts, and airport lounge access!
- 🏨 **Integrated Bookings UI**: A sleek, segmented interface to search for Hotels, Flights, Trains, and Buses.
- 🎨 **Premium UI & Dark Mode**: Built with beautiful glassmorphism gradients, fluid animations, and high-quality haptic feedback. Fully supports dynamic Dark Mode switching.
- 🔐 **Authentication**: User signup and authentication flow with unique username validation powered by **Firebase**.

## 📸 Screenshots

*(Add screenshots of your Home Screen, Diary, Rewards, and Bookings tabs here!)*

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Expo CLI (`npm install -g expo-cli`)
- A [Google Gemini API Key](https://aistudio.google.com/) (Free)
- A Firebase Project (for Authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Travel_saathi.git
   cd Travel_saathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Expo Server**
   ```bash
   npx expo start
   ```

5. **Run the App**
   - Press `a` in the terminal to run on an Android Emulator.
   - Press `i` to run on an iOS Simulator.
   - Or scan the QR code with the **Expo Go** app on your physical device!

## 🛠 Tech Stack

- **Framework**: React Native & Expo
- **Navigation**: React Navigation (Bottom Tabs & Native Stack)
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash)
- **Backend / Auth**: Firebase Firestore & Authentication
- **Feedback**: Expo Haptics
- **Styling**: Vanilla React Native StyleSheet (with custom Theme Context)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/Travel_saathi/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).