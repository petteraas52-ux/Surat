interface MinimalFirebaseTimestamp {
  toDate(): Date;
}

const isFirebaseTimestamp = (value: any): value is MinimalFirebaseTimestamp => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.toDate === "function"
  );
};

type DateInput = MinimalFirebaseTimestamp | string | number | Date;

export const parseTimestampToDateString = (ts: DateInput): string => {
  let dateObj: Date;

  if (isFirebaseTimestamp(ts)) {
    dateObj = ts.toDate();
  } else {
    dateObj = new Date(ts);
  }

  return dateObj.toISOString().split("T")[0];
};

export const parseISODateToLocal = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  return new Date(y, m - 1, d);
};

export const toDateStr = (d: Date): string => d.toISOString().slice(0, 10);

export const getTodayStr = (): string => toDateStr(new Date());

export const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDateStr(d);
};

export const formatDateShort = (dateStr: string): string => {
  const d = new Date(dateStr + "T00:00:00");
  const day = `${d.getDate()}`.padStart(2, "0");
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${day}.${month}`;
};
