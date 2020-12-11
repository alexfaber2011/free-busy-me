import firebase from 'firebase/app';
import {
  FirebaseCalendarProviderCollection
} from './calendar-providers';
import DecoratedGoogleCalendarProviderData from './decorated-google-calendar-provider-data';
import googleCalendarProviderConverter from './google-calendar-provider-converter';

type ListenCallbackSuccess =
  (data: DecoratedGoogleCalendarProviderData) => void;
type ListenCallbackFailure = () => void;

type GoogleCalendarCollectionReference = firebase.firestore.CollectionReference<
  DecoratedGoogleCalendarProviderData
>;

export default class GoogleCalendarProvider {
  private calendarProvidersCollection: GoogleCalendarCollectionReference;

  constructor(calendarCollection: FirebaseCalendarProviderCollection) {
    this.calendarProvidersCollection = calendarCollection
      .withConverter(googleCalendarProviderConverter);
  }

  set(googleProvider: DecoratedGoogleCalendarProviderData): Promise<void> {
    return this.calendarProvidersCollection
      .doc('google')
      .set(googleProvider, { merge: true });
  }

  async setAccessToken(token: string): Promise<void> {
    const snapshot = await this.calendarProvidersCollection.doc('google').get();
    const googleProvider = snapshot.data()
      || new DecoratedGoogleCalendarProviderData();
    googleProvider.setAccessToken(token);
    return this.calendarProvidersCollection.doc('google').set(googleProvider, {
      merge: true
    });
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
