import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateICSFile, downloadICSFile, generateGoogleCalendarUrl, generateOutlookCalendarUrl } from "../calendarUtils";
import type { EventItem } from "@/types/event";

describe("calendarUtils", () => {
  const mockEvent: EventItem = {
    id: "evt-1",
    title: "Test Event",
    date: "2024-03-15",
    time: "10:00 AM WAT",
    location: "Online",
    price: "Free",
    isFree: true,
    category: "Technology",
    speakers: "John Doe",
    description: "Test event description",
  };

  beforeEach(() => {
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock document methods
    document.createElement = vi.fn(() => ({
      href: "",
      download: "",
      click: vi.fn(),
    } as unknown as HTMLAnchorElement));
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  describe("generateICSFile", () => {
    it("should generate valid ICS file content", () => {
      const icsContent = generateICSFile(mockEvent);
      
      expect(icsContent).toContain("BEGIN:VCALENDAR");
      expect(icsContent).toContain("END:VCALENDAR");
      expect(icsContent).toContain("BEGIN:VEVENT");
      expect(icsContent).toContain("END:VEVENT");
      expect(icsContent).toContain("Test Event");
      expect(icsContent).toContain("Online");
    });

    it("should escape special characters", () => {
      const eventWithSpecialChars: EventItem = {
        ...mockEvent,
        title: "Event, with; special chars",
        description: "Description\nwith\nnewlines",
      };
      
      const icsContent = generateICSFile(eventWithSpecialChars);
      expect(icsContent).toContain("Event\\, with\\; special chars");
    });
  });

  describe("downloadICSFile", () => {
    it("should create and download ICS file", () => {
      downloadICSFile(mockEvent);
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith("a");
    });
  });

  describe("generateGoogleCalendarUrl", () => {
    it("should generate valid Google Calendar URL", () => {
      const url = generateGoogleCalendarUrl(mockEvent);
      
      expect(url).toContain("https://calendar.google.com");
      expect(url).toContain("action=TEMPLATE");
      expect(url).toContain("text=Test+Event");
      expect(url).toContain("location=Online");
    });
  });

  describe("generateOutlookCalendarUrl", () => {
    it("should generate valid Outlook Calendar URL", () => {
      const url = generateOutlookCalendarUrl(mockEvent);
      
      expect(url).toContain("https://outlook.live.com");
      expect(url).toContain("subject=Test+Event");
      expect(url).toContain("location=Online");
    });
  });
});

