import { Calendar, FreeBusy, ICalendarRequester } from './types';

export default class NullCalendarRequester implements ICalendarRequester {
  async getCalendarList(): Promise<Calendar[]> {
    return [];
  }
  async getFreeBusy(): Promise<FreeBusy> {
    return {};
  }
  async needsToAuthenticate(): Promise<boolean> {
    return false;
  }
}
