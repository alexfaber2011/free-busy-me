import { CalendarProviderData } from './calendar-providers';

const nullCalendarProviderData: CalendarProviderData = {
  accessToken: null,
  enabledCalendarIds: [],
};

export default class DecoratedGoogleCalendarProviderData {
  private data: CalendarProviderData;
  private enabledCalendarIds: Set<string>;

  constructor(data: CalendarProviderData = nullCalendarProviderData) {
    this.data = data;
    this.enabledCalendarIds = new Set(data.enabledCalendarIds);
  }

  calendarIsEnabled(calendarId: string): boolean {
    return this.enabledCalendarIds.has(calendarId);
  }

  isEnabled(): boolean {
    return !!this.data.accessToken;
  }

  getAccessToken(): string| null {
    return this.data.accessToken;
  }

  setAccessToken(token: string): void {
    this.data.accessToken = token;
  }

  toggleCalendar(calendarId: string): void {
    if (this.enabledCalendarIds.has(calendarId)) {
      this.enabledCalendarIds.delete(calendarId);
    } else {
      this.enabledCalendarIds.add(calendarId);
    }
  }

  getEnabledCalendarIdsArray(): string[] {
    return Array.from(this.enabledCalendarIds);
  }
}
