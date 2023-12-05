import { IUser } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
    // Properties
    isLoggedIn: boolean;
    user?: IUser;
    // Methods
    loginUser: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string }>;
}

export const AuthContext = createContext({} as ContextProps);