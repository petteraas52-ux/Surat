# BarnCheckIn – Management System

A mobile application built with **React Native (Expo)** and **Firebase** for managing employee and parent registrations in kindergartens. The app runs on **iOS, Android, and Web**.

---

## Table of Contents

- [For Assessors](#for-assessors)
- [About](#about)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#2-installation)
- [Built With](#️-built-with)

---

## For Assessors

**PRO203 exam assessors** use the following installation guide in order to run the project, sinde the firebaseEnv.js is provided in the exam delivery. Below we also have provided logins for the various roles.

### Installation & Setup

Run the following commands:

```bash
npm install -g firebase-tools
npm install

cd functions
npm install

npx firebase deploy --only functions
cd ..

npx expo start

```
The installation script might take a while to run, please be patient.<

### Test Credentials

### Parent Account

- **Email**: `parent@parent.com`
- **Password**: `parent1234`
- **PIN**: `1234`

### Employee Account

- **Email**: `employee@employee.com`
- **Password**: `employee1234`
- **PIN**: `1234`

### Admin Account

- **Email**: `admin@admin.com`
- **Password**: `admin1234`
- **PIN**: `1234`

---

## About

This is the source code for the **Surat group PRO203 exam delivery**. It is a cross-platform application that runs on **iOS, Android, and Web**.

The app offers a **guardian interface** intended for parents and legal guardians to check in and check out their children from kindergarten, with additional features such as:

- Upcoming events
- Sickness and vacation registration
- Profile management

It also provides an **employee view** optimized for kindergarten staff, as well as a **dedicated admin role** for user and system management.

---

## Architecture Overview

This project follows a **Full-Stack** approach:

- **Frontend**: React Native (Expo) using TypeScript
- **Backend**: Firebase Cloud Functions (Node.js) using the Admin SDK

> Note:
>
> Cloud Functions are used to handle user creation. This allows an Admin to create new accounts without being logged out of their own session on the device.

---

## Project Structure

- **`functions/src/index.ts`** – Contains the `adminCreateUser` logic (Node.js).
- **`api/adminApi.tsx`** – The bridge that connects the mobile app to the Cloud Function.
- **`components/`** – UI Modals for creating Parents and Employees.
- **`firebaseEnv.js`** – (Local only) Your private Firebase credentials.

---

## Features

### Parent Interface

- Check-in / check-out functionality
- View upcoming events
- Register sickness and vacation
- Profile management

### Employee Interface

- Staff-optimized dashboard
- Child management
- Administrative tools

### Admin Interface

- User management
- Role assignment
- System configuration

---

## Installation (Exam **assessors, please use the provided installation in section** [For Assessors](#for-assessors))

### 1. Prerequisites

- **Node.js**: v18 or higher
- **Firebase CLI**: `npm install -g firebase-tools`
- **Expo Go**: Available on iOS and Android

### 2. Installation

Install dependencies for both frontend and backend:

```bash
npm install -g firebase-tools
npm install

cd functions
npm install
```

### 3. Firebase Configuration

Firebase configuration is ignored by Git due to sensitive keys.

You must create it manually:

1. Create a file named `firebaseEnv.js` in the root directory
2. Add your Firebase Web configuration:

```jsx
// firebaseEnv.js

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Deploy Firebase Functions

```bash
npx firebase deploy --only functions
```

### 5. Start the Application

```bash
npx expo start
```

When Expo starts:

- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

Alternatively, scan the QR code using **Expo Go** on a physical device.

---

## Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Libaries

- [i18next](https://www.i18next.com/)
- [async-storage](https://react-native-async-storage.github.io/3.0-next/)

---

This project is part of the **PRO203 exam delivery**.
