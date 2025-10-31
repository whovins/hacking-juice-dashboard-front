import { createGlobalStyle } from 'styled-components'

// 전역 스타일. 색상은 테마 토큰만 사용.
export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: light dark }
  * { box-sizing: border-box }
  html, body, #root { height: 100% }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
  a { color: inherit; text-decoration: none }
`
