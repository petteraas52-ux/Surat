/**
 * ROOT ROOT LAYOUT (ENTRY POINT)
 * * ROLE:
 * This is the absolute top of the component tree. It wraps the entire application
 * in the 'AuthSessionProvider' to ensure Firebase state is initialized
 * before any navigation occurs.
 * * LOGIC:
 * 1. Auth Provider: Wraps the app in a React Context that tracks user login status.
 * 2. Slot: A headless component from 'expo-router' that renders the current
 * child route (which in your case, is the 'RootLayout' handled previously).
 */

import { AuthSessionProvider } from "@/providers/authctx";
import { Slot } from "expo-router";

export default function RootRootLayout() {
  return (
    <AuthSessionProvider>
      {/* 'Slot' renders the children of this directory. 
          It will render the (app)/_layout.tsx (RootLayout) 
          which then handles the PIN check and role-based routing.
      */}
      <Slot />
    </AuthSessionProvider>
  );
}
