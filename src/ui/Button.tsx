import styled from 'styled-components'

type Variant = 'primary' | 'ghost' | 'danger'
type Props = {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
} & React.ButtonHTMLAttributes<HTMLButtonElement>
// 최소 버튼 컴포넌트. 테마 색상만 참조.
export const Button = styled.button<{ variant?: Variant }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  background: ${({ theme, variant }) => (variant === 'primary' ? theme.colors.primary : 'transparent')};
  color: ${({ theme, variant }) => (variant === 'primary' ? '#fff' : theme.colors.text)};
  &:disabled { opacity: .6; cursor: not-allowed }
`




