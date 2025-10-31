export function getDemoFlag() {
  const q = new URLSearchParams(location.search).get('demo')
  if (q === '1' || q === 'true') return true
  if (q === '0' || q === 'false') return false
  const ls = localStorage.getItem('msw:enabled')
  if (ls === 'true' || ls === 'false') return ls === 'true'
  return (import.meta.env.VITE_DEMO_MSW_DEFAULT ?? 'false') === 'true'
}
export function setDemoFlag(v: boolean) {
  localStorage.setItem('msw:enabled', v ? 'true' : 'false')
}
