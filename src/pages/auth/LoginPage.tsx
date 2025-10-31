import LoginForm from '../../features/auth/LoginForm'
import { useAuthStore } from '../../config/auth-store'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'

const FlexDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`;

export default function LoginPage(){
    const token = useAuthStore(s => s.token)
    if(token) return <Navigate to='/' replace />
    return (
        <FlexDiv>
            <h3>Sign in</h3>
            <p style={{opacity: 0.7}}>Use demo@local / demo1234 (MSW mock)</p>
            <LoginForm />
        </FlexDiv>
    )
}