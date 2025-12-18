/**
 * DATE UTILITIES
 * * ROLE:
 * Normalizes date formats across the application to ensure consistency
 * between Firestore, component state, and localized UI display.
 * * CORE FUNCTIONALITY:
 * 1. Firebase Compatibility: Detects and converts 'MinimalFirebaseTimestamp'
 * into standard JS Date objects.
 * 2. ISO Standardization: Focuses on 'YYYY-MM-DD' as the "Source of Truth"
 * for backend storage and state logic.
 * 3. Localized Formatting: Converts ISO strings into user-friendly formats
 * like 'DD.MM' for the Norwegian/European market.
 */

interface MinimalFirebaseTimestamp {
  toDate(): Date;
}

/**
 * isFirebaseTimestamp
 * Type guard to check if an object is a Firestore Timestamp.
 */
const isFirebaseTimestamp = (value: any): value is MinimalFirebaseTimestamp => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.toDate === "function"
  );
};

type DateInput = MinimalFirebaseTimestamp | string | number | Date;

/**
 * parseTimestampToDateString
 * Converts various date inputs (Firebase, Date objects, or strings)
 * into a clean ISO string: YYYY-MM-DD.
 */
export const parseTimestampToDateString = (ts: DateInput): string => {
  let dateObj: Date;

  if (isFirebaseTimestamp(ts)) {
    dateObj = ts.toDate();
  } else {
    dateObj = new Date(ts);
  }
  // Returns only the date part of the ISO string
  return dateObj.toISOString().split("T")[0];
};

/**
 * parseISODateToLocal
 * Creates a Date object from a YYYY-MM-DD string without time-zone
 * shifting issues often caused by 'new Date(string)'.
 */
export const parseISODateToLocal = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  // Note: Month is 0-indexed in JS Date constructor
  return new Date(y, m - 1, d);
};

/**
 * toDateStr
 * Converts a JS Date object back into an ISO string: YYYY-MM-DD.
 */
export const toDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * getTodayStr
 * Helper to get the current date in ISO format.
 */
export const getTodayStr = (): string => toDateStr(new Date());

/**
 * addDays
 * Performs date arithmetic.
 * @param dateStr The starting date string (YYYY-MM-DD).
 * @param days The number of days to add.
 * @returns The resulting date string (YYYY-MM-DD).
 */
export const addDays = (dateStr: string, days: number): string => {
  const d = parseISODateToLocal(dateStr);

  d.setDate(d.getDate() + days);

  return toDateStr(d);
};

/**
 * formatDateShort
 * Formats an ISO string for UI display (e.g., "18.12").
 */
export const formatDateShort = (dateStr: string): string => {
  const d = parseISODateToLocal(dateStr);

  const day = `${d.getDate()}`.padStart(2, "0");
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${day}.${month}`;
};
