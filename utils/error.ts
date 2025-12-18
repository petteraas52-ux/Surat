/**
 * ERROR UTILITY
 * * ROLE:
 * Centralizes error message retrieval with strict TypeScript enforcement.
 * * CORE FUNCTIONALITY:
 * 1. Domain-Specific Lookups: Allows the app to group errors by feature
 * (e.g., auth, calendar, guestLink) while sharing a 'general' fallback pool.
 * 2. Type Safety: Prevents developers from passing invalid error codes through
 * the use of conditional types and indexed access types.
 * 3. Graceful Fallback: If a specific domain error is missing, it checks
 * the 'general' list before ultimately returning an 'UNKNOWN' error string.
 */

import { errorMessages } from "@/constants/errorMessages";

// Extract domain keys (e.g., 'auth', 'general', 'children') from the constants file
export type ErrorDomain = keyof typeof errorMessages;

/**
 * DomainErrorCode
 * Ensures that the 'code' passed must match a key within the chosen domain.
 */
export type DomainErrorCode<D extends ErrorDomain> =
  keyof (typeof errorMessages)[D];

// Standard fallback codes like 'SERVER' or 'UNKNOWN'
type GeneralErrorCode = keyof (typeof errorMessages)["general"];

/**
 * getErrorMessage
 * Fetches the localized string for a specific error event.
 * * @param domain - The feature area where the error occurred (e.g., "auth").
 * @param code - The specific error key (e.g., "INVALID_CREDENTIALS").
 * @returns A localized string ready for UI display.
 */
export function getErrorMessage<D extends ErrorDomain>(
  domain: D,
  code: DomainErrorCode<D> | GeneralErrorCode
): string {
  const domainMessages = errorMessages[domain] as Record<string, string>;
  const generalMessages = errorMessages.general as Record<string, string>;

  const key = code as string;

  /**
   * RESOLUTION LOGIC:
   * 1. Check if the code exists in the specific domain.
   * 2. If not, check if it's a standard general error.
   * 3. Finally, return the catch-all 'UNKNOWN' error.
   */
  return domainMessages[key] ?? generalMessages[key] ?? generalMessages.UNKNOWN;
}
