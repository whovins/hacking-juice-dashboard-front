import styled from 'styled-components'

export const Tag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtext};
`
