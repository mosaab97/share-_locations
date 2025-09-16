import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
    token: null,
    user: null,
    login: () => {},
    logout: () => {}
});

let logginTimer;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if(userData && userData.token && new Date(userData.exp) > new Date()) {
            login(userData, new Date(userData.exp))
        }
    }, [])

    useEffect(() => {
        if(token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logginTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logginTimer)
        }
    }, [token, tokenExpirationDate])

    const login = (userData, expDate) => {
        setToken(userData.token)
        setUser({id: userData.userId, email: userData.email})
        const tokenExpDate =  expDate || new Date(new Date().getTime() + 1000 * 60 * 60)
        setTokenExpirationDate(tokenExpDate)
        localStorage.setItem('userData', JSON.stringify({...userData, exp: tokenExpDate.toISOString()}))
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);