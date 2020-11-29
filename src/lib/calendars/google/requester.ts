import axios, { AxiosInstance } from 'axios';
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

type Calendar = Pick<
  GoogleCalendarListPageItem,
  'description' | 'id' | 'location' | 'timeZone'
> | { name: string, isOwner: boolean, color: string; };


export default class GoogleRequester {
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
      key: process.env.REACT_APP_FIREBASE_API_KEY,
    };
    this.axios = axios.create({ headers: baseHeaders, params });
  }

  async getCalendarList(): Promise<Calendar[]> {
    try {
      const items = await this.getCalendarListPage();
      console.log('items: ', items);
      return this.massageCalendarList(items);
    } catch (e) {
      console.error(e);
      throw 'Unable to fetch calendar list from Google';
    }
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

      const calendar = {
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
