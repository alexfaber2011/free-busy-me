interface InitializationOptions {
  email: string | null;
  id: string;
  isSignedIn: boolean;
}

const nullOptions: InitializationOptions  = {
  email: '',
  id: '',
  isSignedIn: false,
};

export default class User {
  email: string;
  id: string;
  isSignedIn: boolean;

  constructor(options: InitializationOptions = nullOptions) {
    this.email = options.email || '';
    this.id = options.id;
    this.isSignedIn = options.isSignedIn;
  }
}
