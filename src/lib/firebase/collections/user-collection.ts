import firebase from 'firebase/app';
import User from 'lib/user';
import UserCalendarsCollection from './collections/user-calendars-collection';

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
}
