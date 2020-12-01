import firebase from 'firebase/app';
import User from 'lib/user';
import FirebaseUserDocument from './user-document';

export interface SaveCalendarAccessTokenOptions {
  userId: string;
  provider: 'google';
  accessToken: string;
}

export interface EnableDisableCalendarOptions {
  userId: string;
  provider: 'google';
  calendarId: string;
}

export interface UserDocument {
  foo?: 'bar'
}

export type FirebaseUserCollection = firebase
  .firestore
  .CollectionReference<UserDocument>;

export type FirebaseUserDocumentReference = firebase
  .firestore
  .DocumentReference<UserDocument>;

export default class UserCollection {
  public collection: FirebaseUserCollection;

  constructor(db: firebase.firestore.Firestore) {
    this.collection = db.collection('users') as FirebaseUserCollection;
  }

  user(userId: string): FirebaseUserDocument {
    return new FirebaseUserDocument(this.collection.doc(userId));
  }
}
