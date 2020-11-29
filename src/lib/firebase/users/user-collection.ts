import firebase from 'firebase/app';
import User from 'lib/user';

export interface SaveCalendarAccessTokenOptions {
  userId: string;
  provider: 'google';
  accessToken: string;
}

export interface UserDocument {
  calendarProviders: {
    [name: string]: {
      accessToken: string;
    }
  }
}

type ListenCallbackSuccess = (data: UserDocument) => void;
type ListenCallbackFailure = () => void;

export default class UserCollection {
  private db: firebase.firestore.Firestore;
  public collection: firebase.firestore.CollectionReference;

  constructor(db: firebase.firestore.Firestore) {
    this.db = db;
    this.collection = db.collection('users');
  }

  add(user: User): Promise<void> {
    return this.collection.doc(user.id).set({ email: user.email });
  }

  async get(userId: string): Promise<UserDocument | null> {
    const doc = await this.collection.doc(userId).get();
    if (doc.exists === false) return null;

    return doc.data() as UserDocument;
  }

  listen(
    userId: string,
    onSuccess: ListenCallbackSuccess,
    onError: ListenCallbackFailure
  ): firebase.Unsubscribe {
    return this.collection.doc(userId).onSnapshot(doc => {
      if (doc.exists === false) return onError();

      onSuccess(doc.data() as UserDocument);
    });
  }

  saveCalendarAccessToken(opts: SaveCalendarAccessTokenOptions): Promise<void> {
    return this.collection.doc(opts.userId).set({
      calendarProviders: {
        [opts.provider]: {
          accessToken: opts.accessToken,
        }
      }
    }, { merge: true });
  }
}
