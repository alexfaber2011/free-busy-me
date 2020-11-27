export interface InitializationOptions {
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

  constructor(args: InitializationOptions | User = nullOptions) {
    this.email = args.email || '';
    this.id = args.id;
    this.isSignedIn = args.isSignedIn;
  }
}
