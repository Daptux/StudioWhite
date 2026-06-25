import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'sw_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Verifica el token guardado al cargar
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (token) {
        try {
          const r = await api.me(token)
          if (alive) setUser(r.user)
        } catch {
          if (alive) {
            localStorage.removeItem(STORAGE_KEY)
            setToken('')
          }
        }
      }
      if (alive) setReady(true)
    })()
    return () => {
      alive = false
    }
  }, [token])

  const login = async (username, password) => {
    const r = await api.login(username, password)
    localStorage.setItem(STORAGE_KEY, r.token)
    setToken(r.token)
    setUser(r.user)
    return r
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
