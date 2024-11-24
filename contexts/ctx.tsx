import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../utils/useStorageState';

interface Session {
    token: string;
    user: {
        userId: number;
        email: string;
        fullName: string;
    };
}
  
const AuthContext = createContext<{
    session?: Session | null;
    isLoading: boolean;
    signIn: (data: { token: string; user: { userId: number; fullName: string; email: string } }) => void;
    signOut: () => void;
} | undefined>(undefined);
  
export function useSession() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState<Session | null>('session');
  
    const signIn = async (data: { token: string; user: { userId: number; email: string; fullName: string  } }) => {
      try {
        setSession(data); // Store token and user info
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
    };
  
    const signOut = () => {
      setSession(null); // Clear session
    };
  
    return (
      <AuthContext.Provider
        value={{
          session,
          isLoading,
          signIn,
          signOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
