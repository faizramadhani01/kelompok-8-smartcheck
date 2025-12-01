import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Ambil dari localStorage saat pertama kali load
    useEffect(() => {
        const savedToken = localStorage.getItem('smartcheck_token');
        const savedUser = localStorage.getItem('smartcheck_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Gagal parse smartcheck_user:', err);
            }
        }
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('smartcheck_token', jwtToken);
        localStorage.setItem('smartcheck_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('auth:changed'));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('smartcheck_token');
        localStorage.removeItem('smartcheck_user');
        window.dispatchEvent(new Event('auth:changed'));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
