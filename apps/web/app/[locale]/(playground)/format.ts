// Shared UTC formatters for the live readouts. Every demo reports server
// facts in the same shape so the page reads like one instrument, not five.

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  second: "2-digit",
  timeZone: "UTC",
  year: "numeric",
});

const time = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});

export function formatStamp(date: Date): string {
  return `${dateTime.format(date)} UTC`;
}

export function formatClock(date: Date): string {
  return `${time.format(date)} UTC`;
}
