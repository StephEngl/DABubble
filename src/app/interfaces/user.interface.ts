export interface UserInterface {
  id?: string;
  email: string;
  name: string;
  avatarId: string;
  status: 'online' | 'offline' | 'afk';
}

export interface UserLoginInterface {
  email: string;
  password: string;
}
