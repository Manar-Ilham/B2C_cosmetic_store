import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'consumer' | 'seller' | 'seller-consumer' ;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Consumer',
    email: 'consumer@demo.com',
    password: 'demo123',
    phone: '+1234567890',
    role: 'consumer'
  },
  {
    id: '2',
    name: 'Jane Seller',
    email: 'seller@demo.com',
    password: 'demo123',
    phone: '+1234567891',
    role: 'seller'
  },
  {
    id: '3',
    name: 'Bob Hybrid',
    email: 'hybrid@demo.com',
    password: 'demo123',
    phone: '+1234567892',
    role: 'seller-consumer'
  },

];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('cosmetics_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
 // tell eslint to ignore unused var for this line
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('cosmetics_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role
    };
    
    // Add to mock users (in real app, this would be an API call)
    mockUsers.push({ ...newUser, password: data.password });
    
    setUser(newUser);
    localStorage.setItem('cosmetics_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cosmetics_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};