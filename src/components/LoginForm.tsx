import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      alert('Por favor, digite seu e-mail.')
      return
    }
    
    if (!password.trim()) {
      alert('Por favor, digite sua senha.')
      return
    }

    setLoading(true)

    try {
      await signIn(email, password)
      // Usar notificação mais elegante se disponível
      if (window.Notiflix) {
        window.Notiflix.Notify.success('Login realizado com sucesso!')
      } else {
        alert('Login realizado com sucesso!')
      }
      navigate('/')
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      const errorMessage = error.message || 'Erro ao fazer login'
      
      if (window.Notiflix) {
        window.Notiflix.Notify.failure(errorMessage)
      } else {
        alert(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="registration-section">
      <div className="registration-container">
        <img 
          src="https://images.pexels.com/photos/6112388/pexels-photo-6112388.jpeg?auto=compress&cs=tinysrgb&w=500&h=200&fit=crop" 
          alt="Login" 
          className="w-full rounded-lg mb-6 max-h-[200px] object-cover"
        />
        
        <div className="registration-header-content">
          <img 
            src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=60&fit=crop" 
            alt="Logo Raspou Ganhou" 
            className="registration-logo"
          />
          <h2 className="text-xl text-center font-semibold mt-4">
            Acesse sua conta
          </h2>
          <p className="text-gray-400 text-sm text-center mt-2">
            Entre e continue jogando suas raspadinhas favoritas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="input-group">
            <i className="fa-solid fa-envelope icon"></i>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="E-mail"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
            />
          </div>
          
          <div className="input-group">
            <i className="fa-solid fa-lock icon"></i>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="Senha"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#34D399] text-black font-bold py-4 px-6 rounded-xl hover:bg-[#2cb27a] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="login-link-bottom text-center mt-6">
          <span className="text-gray-400 text-sm">
            Não tem uma conta?{' '}
            <a href="/cadastro" className="text-[#34D399] hover:underline">Cadastre-se</a>
          </span>
        </div>

        <div className="text-center mt-4">
          <a href="/recuperar-senha" className="text-[#34D399] hover:underline text-sm">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </section>
  )
}
