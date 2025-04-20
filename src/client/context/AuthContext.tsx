import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
    pilotId: string |  null | undefined;
    setPilotId: (pilotId: string | null | undefined) => void;
    userId: string | null | undefined;
    setUserId: (userId: string | null | undefined) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [pilotId, setPilotId] = useState<string | null | undefined>(null);
    const [userId, setUserId] = useState<string | null | undefined>(null);

    return (
        <AuthContext.Provider value={{ token, role, setToken, setRole, pilotId, setPilotId, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};