import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import { SessionProvider } from '@/contexts/ctx';

export default function Layout() {
    return (
        <SessionProvider>
            <Stack
                screenOptions={{
                    headerShown: false, // Hides the header for all screens in the Stack
                }}
            />
        </SessionProvider>
    );
}
