import {createContext, useState, useContext, useEffect, useMemo} from 'react'
import {loginUser, logoutUser, registerUser, verifyUser} from '../services/authService.js'


const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkSession(){
            try{
                const data = await verifyUser();
                setUser(data.user || null);
            } catch (err) {
                setUser(null);
             } finally {
                setLoading(false); 
            }
        }
        checkSession();
    }, [])


    async function register(formData){
        const data = await registerUser(formData);
        setUser(data.user);
        return data;
    }

    async function login(formData){
        const data = await loginUser(formData);
        setUser(data.user);
        return data;
    }

    async function logout(){
        await logoutUser();
        setUser(null);
    }

    const value = useMemo(() => ({
        user,
        loading,
        register,
        login,
        logout
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}