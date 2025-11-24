import type { EventItem } from "@/types/event";

/**
 * Generate an .ics file content for calendar integration
 */
export function generateICSFile(event: EventItem): string {
  // Parse date and time
  const eventDate = new Date(event.date);
  
  // Parse time string like "10:00 AM WAT" or "14:30"
  const timeMatch = event.time.match(/(\d+):(\d+)/);
  let hours = 0;
  let minutes = 0;
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
  }
  
  // Check if PM
  const isPM = event.time.toUpperCase().includes("PM");
  const isAM = event.time.toUpperCase().includes("AM");
  
  // Convert to 24-hour format
  let eventHours = hours;
  if (isPM && hours !== 12) {
    eventHours = hours + 12;
  } else if (isAM && hours === 12) {
    eventHours = 0;
  }

  eventDate.setHours(eventHours, minutes || 0, 0, 0);
  
  // End time (default to 2 hours after start)
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 2);

  // Format dates in ICS format (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Escape special characters for ICS format
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Africa Speaks Connect//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@africaspeaksconnect.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(eventDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description || "")}\\n\\nLocation: ${event.location}\\nPrice: ${event.price}`,
    `LOCATION:${escapeICS(event.location)}`,
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Download ICS file for event
 */
export function downloadICSFile(event: EventItem): void {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: EventItem): string {
  const eventDate = new Date(event.date);
  
  // Parse time string like "10:00 AM WAT" or "14:30"
  const timeMatch = event.time.match(/(\d+):(\d+)/);
  let hours = 0;
  let minutes = 0;
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
  }
  
  // Check if PM
  const isPM = event.time.toUpperCase().includes("PM");
  const isAM = event.time.toUpperCase().includes("AM");
  
  // Convert to 24-hour format
  let eventHours = hours;
  if (isPM && hours !== 12) {
    eventHours = hours + 12;
  } else if (isAM && hours === 12) {
    eventHours = 0;
  }

  eventDate.setHours(eventHours, minutes || 0, 0, 0);
  
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 2);

  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(eventDate)}/${formatGoogleDate(endDate)}`,
    details: event.description || "",
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: EventItem): string {
  const eventDate = new Date(event.date);
  
  // Parse time string like "10:00 AM WAT" or "14:30"
  const timeMatch = event.time.match(/(\d+):(\d+)/);
  let hours = 0;
  let minutes = 0;
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
  }
  
  // Check if PM
  const isPM = event.time.toUpperCase().includes("PM");
  const isAM = event.time.toUpperCase().includes("AM");
  
  // Convert to 24-hour format
  let eventHours = hours;
  if (isPM && hours !== 12) {
    eventHours = hours + 12;
  } else if (isAM && hours === 12) {
    eventHours = 0;
  }

  eventDate.setHours(eventHours, minutes || 0, 0, 0);
  
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 2);

  const formatOutlookDate = (date: Date): string => {
    return date.toISOString();
  };

  const params = new URLSearchParams({
    subject: event.title,
    startdt: formatOutlookDate(eventDate),
    enddt: formatOutlookDate(endDate),
    body: `${event.description || ""}\n\nLocation: ${event.location}\nPrice: ${event.price}`,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

