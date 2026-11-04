export interface UserSession {
  email: string
  name: string
  role?: 'customer' | 'admin'
}
