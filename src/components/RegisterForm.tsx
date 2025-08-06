import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    confirmSenha: '',
    aceiteTermos: false
  })

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11)
    if (numericValue.length <= 10) {
      return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'telefone' && typeof value === 'string') {
      value = formatPhone(value)
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!formData.nome.trim()) {
      alert('Por favor, digite seu nome completo.')
      return false
    }
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      alert('Por favor, digite um telefone válido.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      alert('Por favor, digite seu e-mail.')
      return false
    }
    if (!formData.senha.trim()) {
      alert('Por favor, digite sua senha.')
      return false
    }
    if (formData.senha !== formData.confirmSenha) {
      alert('As senhas não coincidem.')
      return false
    }
    if (!formData.aceiteTermos) {
      alert('Você deve aceitar os termos e políticas de privacidade.')
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setLoading(true)

    try {
      await signUp(formData.email, formData.senha, formData.nome, formData.telefone)
      if (window.Notiflix) {
        window.Notiflix.Notify.success('Cadastro realizado com sucesso!')
      } else {
        alert('Cadastro realizado com sucesso!')
      }
      navigate('/login')
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error)
      const errorMessage = error.message || 'Erro ao cadastrar usuário'
      
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
          alt="Cadastro" 
          className="w-full rounded-lg mb-6 max-h-[200px] object-cover"
        />
        
        <div className="registration-header-content">
          <img 
            src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=60&fit=crop" 
            alt="Logo Raspou Ganhou" 
            className="registration-logo"
          />
          <h2 className="text-xl text-center font-semibold mt-4">
            {step === 1 ? 'Crie sua conta gratuita. Vamos começar?' : 'Finalize seu cadastro'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step active space-y-5">
              <div className="input-group">
                <i className="fa-solid fa-user icon"></i>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required 
                  placeholder="Nome completo"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-phone icon"></i>
                <input 
                  type="text" 
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  required 
                  placeholder="Telefone"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
                />
              </div>
              <div className="button-group">
                <button 
                  type="button" 
                  onClick={handleContinue}
                  className="btn-primary w-full bg-[#34D399] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#2cb27a] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continuar <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step active space-y-5">
              <div className="input-group">
                <i className="fa-solid fa-envelope icon"></i>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required 
                  placeholder="E-mail"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-lock icon"></i>
                <input 
                  type="password" 
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  required 
                  placeholder="Senha"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-shield-alt icon"></i>
                <input 
                  type="password" 
                  value={formData.confirmSenha}
                  onChange={(e) => handleInputChange('confirmSenha', e.target.value)}
                  required 
                  placeholder="Confirmar senha"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-400 focus:border-[#34D399] transition-all duration-300"
                />
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="aceiteTermos" 
                  checked={formData.aceiteTermos}
                  onChange={(e) => handleInputChange('aceiteTermos', e.target.checked)}
                  required
                  className="w-5 h-5 rounded border-2 border-[#333333] bg-[#1a1a1a] checked:bg-[#34D399] checked:border-[#34D399]"
                />
                <label htmlFor="aceiteTermos" className="text-sm text-gray-300">
                  Declaro que tenho mais de 18 anos de idade e aceito os{' '}
                  <a href="/politica" target="_blank" className="text-[#34D399] hover:underline">Termos</a>
                  {' '}e{' '}
                  <a href="/politica" target="_blank" className="text-[#34D399] hover:underline">Políticas de Privacidade</a>
                </label>
              </div>
              <div className="button-group flex gap-4">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="btn-secondary flex-1 bg-[#333333] text-white font-medium py-3 px-6 rounded-xl hover:bg-[#555555] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-arrow-left"></i> Voltar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-1 bg-[#34D399] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#2cb27a] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar conta'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="login-link-bottom text-center mt-6">
          <span className="text-gray-400 text-sm">
            Já tem uma conta?{' '}
            <a href="/login" className="text-[#34D399] hover:underline">Conecte-se</a>
          </span>
        </div>
      </div>
    </section>
  )
}
