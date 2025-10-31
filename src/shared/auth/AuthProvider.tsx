import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../../config/auth-store";

function AuthProvider({children}:{children:ReactNode}) {
    const token = useAuthStore(s => s.token)
    const setToken = useAuthStore(s => s.setToken)

    useEffect(() => {
        if(token === null){
            try {
                const raw = sessionStorage.getItem('auth')
                if(raw){
                    const {token: t} = JSON.parse(raw);
                    if (t) setToken(t);
                }
            } catch{}
        }
    }, [token, setToken])
    return <>{children}</>
    
} 

export default AuthProvider;