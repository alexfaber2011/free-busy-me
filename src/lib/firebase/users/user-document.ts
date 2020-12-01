import firebase from 'firebase/app';
import CalendarProvidersCollection
  from './calendar-providers/calendar-providers';
import { FirebaseUserDocumentReference, UserDocument } from './user-collection';

type ListenCallbackSuccess = (data: UserDocument) => void;
type ListenCallbackFailure = () => void;

export default class FirebaseUserDocument {
  private docRef: FirebaseUserDocumentReference;
  public calendarProviders: CalendarProvidersCollection;

  constructor(userDocRef: FirebaseUserDocumentReference) {
    this.docRef = userDocRef;
    this.calendarProviders = new CalendarProvidersCollection(userDocRef);
  }

  async get(): Promise<UserDocument | null> {
    const doc = await this.docRef.get();
    return doc.data() || null;
  }

  listen(
    onSuccess: ListenCallbackSuccess,
    onError: ListenCallbackFailure
  ): firebase.Unsubscribe {
    return this.docRef.onSnapshot(doc => {
      const userDocument = doc.data();
      if (userDocument === undefined) return onError();

      onSuccess(userDocument);
    });
  }
}
