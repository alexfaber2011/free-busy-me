export default class Routes {
  calendarList: string;
  freeBusy: string;

  constructor() {
    this.calendarList =
      'https://www.googleapis.com/calendar/v3/users/me/calendarList';
    this.freeBusy = 'https://www.googleapis.com/calendar/v3/freeBusy';
  }
}
