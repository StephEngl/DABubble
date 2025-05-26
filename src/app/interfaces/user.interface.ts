export interface UserInterface {
  id?: string;
  email: string;
  name: string;
  avatarId: string;
  status: 'online' | 'offline' | 'afk';
  // directChatsWith?: string[]; // => all directMessages this user has active
}

export interface UserLoginInterface {
  email: string;
  password: string;
}
