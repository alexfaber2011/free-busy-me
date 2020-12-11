import firebase from 'firebase/app';
import { FirebaseUserDocumentReference } from '../user-collection';
import GoogleCalendarProvider from './google-calendar-provider';

export interface CalendarProviderData {
  accessToken: string | null;
  enabledCalendarIds: Array<string>;
}

export type FirebaseCalendarProviderCollection = firebase
  .firestore
  .CollectionReference<CalendarProviderData>;

export default class CalendarProvidersCollection {
  private userDocRef: FirebaseUserDocumentReference;
  public collection: FirebaseCalendarProviderCollection;
  public google: GoogleCalendarProvider;

  constructor(userDocRef: FirebaseUserDocumentReference) {
    this.userDocRef = userDocRef;
    this.collection = userDocRef
      .collection('calendarProviders') as FirebaseCalendarProviderCollection;
    this.google = new GoogleCalendarProvider(this.collection);
  }
}
