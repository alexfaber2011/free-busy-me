import firebase from 'firebase/app';
import {
  CalendarProviderData,
  FirebaseCalendarProviderCollection
} from './calendar-providers';

type ListenCallbackSuccess = (data: CalendarProviderData) => void;
type ListenCallbackFailure = () => void;

export default class GoogleCalendarProvider {
  private calendarProvidersCollection: FirebaseCalendarProviderCollection;

  constructor(calendarCollection: FirebaseCalendarProviderCollection) {
    this.calendarProvidersCollection = calendarCollection;
  }

  async disableCalendar(calendarId: string): Promise<void> {
    return this.calendarProvidersCollection.doc('google').update({
      [`enabledCalendarsById.${calendarId}`]: false,
    });
  }

  async enableCalendar(calendarId: string): Promise<void> {
    return this.calendarProvidersCollection.doc('google').update({
      [`enabledCalendarsById.${calendarId}`]: true,
    });
  }

  async setAccessToken(token: string): Promise<void> {
    return this.calendarProvidersCollection.doc('google').set({
      accessToken: token,
    }, { merge: true });
  }

  listen(
    onSuccess: ListenCallbackSuccess,
    onError: ListenCallbackFailure,
  ): firebase.Unsubscribe {
    return this.calendarProvidersCollection.doc('google').onSnapshot(doc => {
      const calendarProviderDocument = doc.data();
      if (calendarProviderDocument === undefined) return onError();

      onSuccess(calendarProviderDocument);
    });
  }
}
