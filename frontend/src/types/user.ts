export interface User {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'farmer' | 'buyer';
  location: string;
  walletBalance: number;
  profileImage?: string;
  rating: number;
  createdAt: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
