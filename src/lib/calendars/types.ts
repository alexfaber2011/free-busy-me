export interface Calendar {
  description?: string;
  id: string;
  location?: string;
  timeZone?: string;
  name: string;
  isOwner: boolean;
  color: string;
}

export interface ICalendarRequester {
  getCalendarList(): Promise<Calendar[]>;
  needsToAuthenticate(): Promise<boolean>;
}
