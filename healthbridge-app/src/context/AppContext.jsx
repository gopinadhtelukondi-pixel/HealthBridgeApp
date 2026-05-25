import { createContext, useCallback, useContext, useState } from 'react'

const AppContext = createContext({
  addToast: () => {},
  toasts: [],
  currentUser: null,
  token: null,
  setAuthenticatedUser: () => {},
  loginAsPatient: () => {},
  loginAsDoctor: () => {},
  logout: () => {},
})

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('healthbridge_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('healthbridge_token'))

  const addToast = useCallback((message, type = '') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  const setAuthenticatedUser = useCallback((user, authToken = null) => {
    // FIX: auth forms now save the MongoDB-backed user returned by the API.
    setCurrentUser(user)
    setToken(authToken)
    localStorage.setItem('healthbridge_user', JSON.stringify(user))
    if (authToken) {
      localStorage.setItem('healthbridge_token', authToken)
    } else {
      localStorage.removeItem('healthbridge_token')
    }
  }, [])

  const loginAsPatient = useCallback(() => {
    addToast('Use the patient login form to continue.', 'error')
  }, [addToast])

  const loginAsDoctor = useCallback(() => {
    addToast('Use the doctor login form to continue.', 'error')
  }, [addToast])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('healthbridge_user')
    localStorage.removeItem('healthbridge_token')
  }, [])

  return (
    <AppContext.Provider value={{ addToast, toasts, currentUser, token, setAuthenticatedUser, loginAsPatient, loginAsDoctor, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
