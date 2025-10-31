import {create} from 'zustand'

type AuthState = {
    token: string | null
    user?: {email: string} | null
    setToken: (t: string | null) => void
    logout: () => void
}

function readSession() {
    try{
        const raw = sessionStorage.getItem('auth')
        if(!raw) return {token: null, user: null}
        return JSON.parse(raw) as { token: string | null; user: {email: string} | null}
    } catch (e) {
        return {token: null, user: null}
    }
}

export const useAuthStore = create<AuthState>((set, get) => ({
    ...readSession(),
    setToken: t => {
        const user = t ? get().user ?? {email: 'abc@abc.com'} : null
        set({token: t, user})

        try {
            sessionStorage.setItem('auth', JSON.stringify({token: t,user}))
        } catch {}
    },
    logout: () => {
        set({token: null, user: null})
        try {
            sessionStorage.removeItem('auth')
        } catch {}
    }
}))