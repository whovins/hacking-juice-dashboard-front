import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0% { opacity: .6 }
  50% { opacity: .35 }
  100% { opacity: .6 }
`

export const Skeleton = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  animation: ${pulse} 1.2s ease-in-out infinite;
`
