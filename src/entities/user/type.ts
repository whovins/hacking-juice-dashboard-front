export type User = {
  id: string
  email: string
  name: string
  role: 'viewer' | 'analyst' | 'manager' | 'admin'
}
