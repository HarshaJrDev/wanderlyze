export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    gender: 'male' | 'female' | 'other';
    age: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    SplashScreen:undefined;
    OnBoardScreen:undefined
  };
  
  export type MainStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
  };