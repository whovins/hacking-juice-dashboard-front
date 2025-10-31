import LoginForm from '../../features/auth/LoginForm'
import { useAuthStore } from '../../config/auth-store'
import { Navigate } from 'react-router-dom'

export default function LoginPage(){
    const token = useAuthStore(s => s.token)
    if(token) return <Navigate to='/' replace />
    return (
        <div>
            <h3>Sign in</h3>
            <p style={{opacity: 0.7}}>Use demo@local / demo1234 (MSW mock)</p>
            <LoginForm />
        </div>
    )
}