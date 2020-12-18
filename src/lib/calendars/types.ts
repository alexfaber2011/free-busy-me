import {DateTime} from 'luxon';

export interface Calendar {
  description?: string;
  id: string;
  location?: string;
  timeZone?: string;
  name: string;
  isOwner: boolean;
  color: string;
}

export interface FreeBusyOptions {
  startDate?: DateTime;
  endDate?: DateTime;
  calendarIds: string[];
}

export interface Event {
  start: DateTime;
  end: DateTime;
}

export interface FreeBusy {
  [calendarId: string]: Event[];
}

export interface ICalendarRequester {
  getCalendarList(): Promise<Calendar[]>;
  getFreeBusy(options: FreeBusyOptions): Promise<FreeBusy>;
  needsToAuthenticate(): Promise<boolean>;
}
