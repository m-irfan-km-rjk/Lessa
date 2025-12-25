"use client";
import { createContext, useEffect, useState } from "react";
import client from "../../api/client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { user } } = client.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };