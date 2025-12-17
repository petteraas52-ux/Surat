📋 BarnCheckIn - Management System
A mobile application built with React Native (Expo) and Firebase for managing employee and parent registrations.

🏗 Architecture Overview
This project uses a Full-Stack approach:

Frontend: React Native (Expo) using TypeScript.

Backend: Firebase Cloud Functions (Node.js) using the Admin SDK.

Note: We use Cloud Functions to handle user creation. This allows an Admin to create new accounts without being logged out of their own session on the device.

🚀 Getting Started

1. Prerequisites
   Node.js: v18 or higher.

Firebase CLI: Install globally via npm install -g firebase-tools.

Expo Go: Available on iOS and Android.

2. Installation
   Install dependencies for both the frontend and the backend:

Bash

# Install root (Mobile App) dependencies

npm install

# Install backend (Cloud Functions) dependencies

cd functions
npm install
cd .. 3. Firebase Configuration
Since the configuration contains sensitive keys, it is ignored by Git. You must create it manually:

Create a file named firebaseEnv.js in the root directory.

Add your Firebase Web configuration:

JavaScript

// firebaseEnv.js
export const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
}; 4. Deploying the Backend
The "Create User" features will not work until the Cloud Functions are deployed to your Firebase project:

Bash

# Navigate to functions folder

cd functions

# Deploy to Google Cloud

npx firebase deploy --only functions

# Return to root

cd .. 5. Running the App
Start the Expo development server:

Bash

npx expo start
Press i for iOS Simulator.

Press a for Android Emulator.

Scan the QR Code to test on a physical device.

🛠 Project Structure
functions/src/index.ts: Contains the adminCreateUser logic (Node.js).

api/adminApi.tsx: The bridge that connects the mobile app to the Cloud Function.

components/: UI Modals for creating Parents and Employees.

firebaseEnv.js: (Local only) Your private Firebase credentials.

🧪 Testing the Admin Flow
Log in as an Admin.

Open the Create Parent or Create Employee modal.

Fill in the details and click Create.

Observation: The app will stay on the management screen (no logout), while the new user appears in the Firebase Authentication console.
