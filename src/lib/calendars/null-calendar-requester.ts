import { Calendar, ICalendarRequester } from './types';

export default class NullCalendarRequester implements ICalendarRequester {
  getCalendarList(): Promise<Calendar[]> {
    return Promise.resolve([]);
  }
}
