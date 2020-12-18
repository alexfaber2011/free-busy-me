import axios, { AxiosInstance } from 'axios';
import {DateTime} from 'luxon';
import {Calendar, FreeBusy, Event, FreeBusyOptions, ICalendarRequester} from '../types';
import Routes from './routes';

type AccessRole = 'freeBusyRole' | 'reader' | 'writer' | 'owner';

interface GoogleCalendarListPageItem {
  accessRole: AccessRole;
  backgroundColor?: string;
  description?: string;
  hidden?: boolean;
  id: string;
  location?: string;
  primary?: boolean;
  summary: string; // title of the calendar
  summaryOverride?: string;
  timeZone?: string;
}

// https://developers.google.com/calendar/v3/reference/calendarList#resource
interface GoogleCalendarListPage {
  kind: string;
  etag: string;
  nextPageToken: string | undefined; // used to access the next page of this result
  nextSyncToken: string | undefined; // used at a later point in time to retrieve only the entries that have changed
  items: GoogleCalendarListPageItem[];
}

interface FreeBusyRequestBody {
  timeMin: string; // datetime RFC3339
  timeMax: string; // datetime RFC3339
  calendarExpansionMax: number;
  items: Array<{id: string}>; // calendar ids
}

interface FreeBusyError {
  domain: string;
  reason: string;
}

interface CalInfoFreeBusyEvent {
  start: string;
  end: string;
}

interface FreeBusyCalendarInfo {
  errors?: FreeBusyError;
  busy: CalInfoFreeBusyEvent[];
}

// https://developers.google.com/calendar/v3/reference/freebusy/query
interface FreeBusyResponse {
  kind: string;
  timeMin: string;
  timeMax: string;
  calendars?: {
    [calendarId: string]: FreeBusyCalendarInfo;
  }
}

export default class GoogleRequester implements ICalendarRequester {
  private routes: Routes;
  private axios: AxiosInstance;

  constructor(accessToken: string, routes: Routes = new Routes()) {
    this.routes = routes;
    const baseHeaders = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const params = {
      alt: 'json',
    };
    this.axios = axios.create({ headers: baseHeaders, params });
  }

  async getCalendarList(): Promise<Calendar[]> {
    try {
      const items = await this.getCalendarListPage();
      return this.massageCalendarList(items);
    } catch (e) {
      console.error(e);
      throw 'Unable to fetch calendar list from Google';
    }
  }

  async getFreeBusy(options: FreeBusyOptions): Promise<FreeBusy> {
    try {
      const response = await this.axios.post<
        FreeBusyResponse
      >(this.routes.freeBusy, this.prepareFreeBusyRequestBody(options));
      return this.massageFreeBusyResponse(response.data);
    } catch (e) {
      console.error(e);
      throw 'Unable to fetch free busy info from Google';
    }
  }

  async needsToAuthenticate(): Promise<boolean> {
    try {
      await this.axios.get(this.routes.calendarList);
      return false;
    } catch {
      return true;
    }
  }

  private prepareFreeBusyRequestBody = (
    options: FreeBusyOptions
  ): FreeBusyRequestBody => {
    return {
      timeMin: this.buildTimeMin(options.startDate),
      timeMax: this.buildTimeMax(options.endDate),
      calendarExpansionMax: 50,
      items: options.calendarIds.map(id => ({ id })),
    };
  }

  private buildTimeMin(date?: DateTime): string {
    const d = date || DateTime.local();
    return this.toRFC3339(d);
  }

  private buildTimeMax(date?: DateTime): string {
    const d = date || DateTime.local().plus({weeks: 2});
    return this.toRFC3339(d);
  }

  private toRFC3339(date: DateTime): string {
    return date.toISO();
  }

  private massageFreeBusyResponse(response: FreeBusyResponse): FreeBusy {
    if (!response.calendars) return {};

    return Object.entries(response.calendars)
      .reduce((acc, [calendarId, v]) => {
        return {
          ...acc,
          [calendarId]: this.toEventArray(v),
        };
      }, {});
  }

  private toEventArray(i: FreeBusyCalendarInfo): Event[] {
    if (i.errors || !i.busy) return [];

    return i.busy.map(b => ({
      start: DateTime.fromISO(b.start),
      end: DateTime.fromISO(b.end),
    }));
  }

  private async getCalendarListPage(
    acc: GoogleCalendarListPageItem[] = []
  ): Promise<GoogleCalendarListPageItem[]> {
    const response = await this.axios.get<GoogleCalendarListPage>(
      this.routes.calendarList
    );
    const items = [...acc, ...response.data.items];
    return response.data.nextPageToken
      ? await this.getCalendarListPage(items)
      : items;
  }

  private massageCalendarList(items: GoogleCalendarListPageItem[]): Calendar[] {
    return items.reduce((acc, i) => {
      if (i.hidden) return acc;

      const calendar: Calendar = {
        color: i.backgroundColor || '#42d692',
        description: i.description,
        id: i.id,
        location: i.location,
        isOwner: i.accessRole === 'owner',
        name: i.summaryOverride || i.summary,
        timeZone: i.timeZone,
      };

      return [...acc, calendar];
    }, [] as Calendar[]);
  }
}
