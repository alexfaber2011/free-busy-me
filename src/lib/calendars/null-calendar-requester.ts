import { Calendar, ICalendarRequester } from './types';

export default class NullCalendarRequester implements ICalendarRequester {
  async getCalendarList(): Promise<Calendar[]> {
    return [];
  }
  async needsToAuthenticate(): Promise<boolean> {
    return false;
  }
}
