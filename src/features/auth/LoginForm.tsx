import { useState } from "react";
import { Button } from '../../ui/Button';
import { useAuthStore } from "../../config/auth-store";
import { useNavigate } from "react-router-dom";
function LoginForm() {

    const [email, setEmail] = useState("abc@abc.com");
    const [password, setPassword] = useState("pass1234");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<null | string>(null)
    const setToken = useAuthStore(s => s.setToken)
    const navigate = useNavigate()
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch('/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password}),
            })
            if(!res.ok) throw new Error(`${res.status}`);
            const data = (await res.json()) as {access_token: string}
            setToken(data.access_token)
            navigate('/', { replace: true })
        } catch(e){
            setErr('Login Failed');
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={onSubmit} style={{display: 'grid', gap: 12, maxWidth: 360}}>
            <div>
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email"/>
            </div>
            <div>
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password"/>
            </div>
            {err && <div style={{color: 'tomato'}}>{err}</div>}
            <Button variant="primary" disabled={loading}>{loading ? 'Signing in..' : 'Sign in'}</Button>
        </form>
    )
}

export default LoginForm;