import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  // Setup axios interceptor for authentication
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [accessToken])

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, userData)
      if (response.data.access_token) {
        const token = response.data.access_token
        setAccessToken(token)
        localStorage.setItem('accessToken', token)
        setCurrentUser(response.data.user)
        return { success: true, user: response.data.user }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.response?.data?.detail || 'Registration failed' }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password })
      if (response.data.access_token) {
        const token = response.data.access_token
        setAccessToken(token)
        localStorage.setItem('accessToken', token)
        setCurrentUser(response.data.user)
        return { success: true, user: response.data.user }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAccessToken(null)
      localStorage.removeItem('accessToken')
      setCurrentUser(null)
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE}/profile/me`, profileData)
      if (response.data.profile) {
        setCurrentUser(response.data.profile)
        return { success: true, profile: response.data.profile }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: error.response?.data?.detail || 'Profile update failed' }
    }
  }

  const getCurrentUser = async () => {
    if (!accessToken) return null
    
    try {
      const response = await axios.get(`${API_BASE}/profile/me`)
      if (response.data) {
        setCurrentUser(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Get current user error:', error)
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout()
      }
      return null
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        await getCurrentUser()
      }
      setLoading(false)
    }

    initializeAuth()
  }, [accessToken])

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    getCurrentUser,
    accessToken,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
