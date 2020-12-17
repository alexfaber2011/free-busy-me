import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import UserCollection from './users';
import User from 'lib/user';

// General Setup

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Authentication Setup

type OnAuthStateChangeListener = (user: User) => void;

// Because the types for result.credential aren't right, this'll cover our
// use case
type GoogleAuthCredential = { accessToken: string };

export interface IFirebaseHelper {
  onAuthStateChange(cb: OnAuthStateChangeListener): firebase.Unsubscribe;
  signInWithGoogle(): Promise<User>;
}

class FirebaseHelper implements IFirebaseHelper {
  private firebase: typeof firebase;
  public db: firebase.firestore.Firestore;
  public users: UserCollection;

  constructor(injectedFirebase?: typeof firebase) {
    this.firebase = injectedFirebase || firebase;
    this.firebase.initializeApp(firebaseConfig);
    this.db = this.firebase.firestore();
    this.users = new UserCollection(this.db);
  }

  onAuthStateChange(cb: OnAuthStateChangeListener): firebase.Unsubscribe {
    return this.firebase.auth().onAuthStateChanged((user = null) => {
      if (user === null) return cb(new User());

      cb(new User({
        email: user.email,
        id: user.uid,
        isSignedIn: true,
      }));
    });
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new this.firebase.auth.GoogleAuthProvider();
    const calendars = 'https://www.googleapis.com/auth/calendar.readonly';
    const events = 'https://www.googleapis.com/auth/calendar.events.readonly';
    provider.addScope(calendars);
    provider.addScope(events);
    try {
      const result = await this.firebase.auth().signInWithPopup(provider);
      return this.handleSignInResult(result);
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async handleSignInResult(
    result: firebase.auth.UserCredential
  ): Promise<User> {
    try {
      if (result.user === null) throw 'No user from firebase';

      const credential = result.credential as unknown as GoogleAuthCredential;

      await this.users
        .user(result.user.uid)
        .calendarProviders
        .google
        .setAccessToken(credential.accessToken);

      const options = {
        email: result.user.email,
        id: result.user.uid,
        isSignedIn: true
      };
      return new User(options);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

const firebaseHelper = new FirebaseHelper();

export default firebaseHelper;
