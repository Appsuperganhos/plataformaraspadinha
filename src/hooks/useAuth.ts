import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export type User = {
  id: string
  email: string
  nome: string
  telefone?: string
  saldo: number
  created_at?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se usuário está logado via localStorage
    const isLoggedIn = localStorage.getItem('usuarioLogado') === 'true'
    const userData = localStorage.getItem('userData')
    
    if (isLoggedIn && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error)
        localStorage.removeItem('usuarioLogado')
        localStorage.removeItem('userData')
      }
    }
    
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, nome: string, telefone?: string) => {
    const response = await api.register(nome, email, password, telefone)
    
    if (!response.success) {
      throw new Error(response.mensagem)
    }
    
    return response
  }

  const signIn = async (email: string, password: string) => {
    const response = await api.login(email, password)
    
    if (!response.success) {
      throw new Error(response.mensagem)
    }
    
    if (response.usuario) {
      // Salvar dados do usuário no localStorage
      localStorage.setItem('usuarioLogado', 'true')
      localStorage.setItem('userData', JSON.stringify(response.usuario))
      setUser(response.usuario)
    }
    
    return response
  }

  const signOut = async () => {
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('userData')
    setUser(null)
  }

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, saldo: newBalance }
      setUser(updatedUser)
      localStorage.setItem('userData', JSON.stringify(updatedUser))
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateBalance
  }
}
