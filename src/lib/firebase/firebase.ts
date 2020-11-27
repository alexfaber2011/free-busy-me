import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import UserCollection, { SaveCalendarAccessTokenOptions } from './users';
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
  signInWithGoogle(): void;
  onRedirectComplete(): Promise<void>;
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

  signInWithGoogle(): void {
    const provider = new this.firebase.auth.GoogleAuthProvider();
    const calendars = 'https://www.googleapis.com/auth/calendar.readonly';
    const events = 'https://www.googleapis.com/auth/calendar.events.readonly';
    provider.addScope(calendars);
    provider.addScope(events);
    this.firebase.auth().signInWithRedirect(provider);
  }

  async onRedirectComplete(): Promise<void> {
    try {
      const result = await this.firebase.auth().getRedirectResult();
      if (result.user === null) return;

      const credential = result.credential as unknown as GoogleAuthCredential;
      const opts: SaveCalendarAccessTokenOptions = {
        userId: result.user.uid,
        accessToken: credential.accessToken,
        provider: 'google',
      };
      await this.users.saveCalendarAccessToken(opts);
    } catch (e) {
      console.error(e);
    }
  }
}

const firebaseHelper = new FirebaseHelper();

export default firebaseHelper;
