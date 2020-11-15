import firebase from 'firebase/app';
import 'firebase/auth';
import User from './user';

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

class FirebaseHelper {
  private firebase: typeof firebase;

  constructor(injectedFirebase?: typeof firebase) {
    this.firebase = injectedFirebase || firebase;
    this.firebase.initializeApp(firebaseConfig);
  }

  async signIn(
    email: string,
    password: string
  ): Promise<void> {
    await this.firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async signUp(email: string, password: string): Promise<void> {
    await this.firebase.auth().createUserWithEmailAndPassword(email, password);
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

  async getUserInfoAfterRedirect(): Promise<string> {
    try {
      const result = await firebase.auth().getRedirectResult();
      console.log('result: ', result);
      return 'hello';
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new FirebaseHelper();
