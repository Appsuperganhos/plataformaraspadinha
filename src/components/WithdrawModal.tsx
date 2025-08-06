import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

interface WithdrawModalProps {
  onClose: () => void
  userBalance: number
  userName: string
}

export default function WithdrawModal({ onClose, userBalance, userName }: WithdrawModalProps) {
  const { updateBalance } = useAuth()
  const [amount, setAmount] = useState('')
  const [pixType, setPixType] = useState('CPF')
  const [pixKey, setPixKey] = useState('')
  const [beneficiaryName, setBeneficiaryName] = useState(userName)
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('')
  const [loading, setLoading] = useState(false)

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    if (numericValue) {
      const floatValue = parseInt(numericValue) / 100
      return floatValue.toFixed(2).replace('.', ',')
    }
    return '0,00'
  }

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11)
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11)
    if (numericValue.length <= 10) {
      return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  const getPixKeyPlaceholder = () => {
    switch (pixType) {
      case 'CPF': return '000.000.000-00'
      case 'E-MAIL': return 'seu@email.com'
      case 'TELEFONE': return '(11) 99999-9999'
      case 'ALEATORIA': return 'Chave aleatória de 32 caracteres'
      default: return 'Digite sua chave Pix'
    }
  }

  const handlePixKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    if (pixType === 'CPF') {
      value = formatCPF(value)
    } else if (pixType === 'TELEFONE') {
      value = formatPhone(value)
    }
    
    setPixKey(value)
  }

  const validatePixKey = () => {
    if (pixType === 'CPF') {
      return pixKey.replace(/\D/g, '').length === 11
    } else if (pixType === 'E-MAIL') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)
    } else if (pixType === 'TELEFONE') {
      const cleanKey = pixKey.replace(/\D/g, '')
      return cleanKey.length >= 10 && cleanKey.length <= 11
    } else if (pixType === 'ALEATORIA') {
      return pixKey.length >= 32
    }
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numericAmount = parseFloat(amount.replace(',', '.'))
    const cleanDocument = beneficiaryDocument.replace(/\D/g, '')

    if (numericAmount < 50) {
      alert('Valor mínimo para saque é R$ 50,00')
      return
    }

    if (numericAmount > userBalance) {
      alert('Valor maior que o saldo disponível')
      return
    }

    if (!validatePixKey()) {
      alert('Chave Pix inválida')
      return
    }

    if (cleanDocument.length !== 11) {
      alert('CPF do beneficiário inválido')
      return
    }

    setLoading(true)

    try {
      // Usar sua API real de saque
      const response = await api.withdraw({
        amount: numericAmount,
        pixKey,
        pixType,
        beneficiaryName,
        beneficiaryDocument: cleanDocument
      })
      
      if (response.success) {
        const newBalance = userBalance - numericAmount
        updateBalance(newBalance)
        
        if (window.Notiflix) {
          window.Notiflix.Notify.success(response.message || 'Saque solicitado com sucesso!')
        } else {
          alert(response.message || 'Saque solicitado com sucesso!')
        }
        onClose()
      } else {
        throw new Error(response.message || 'Erro ao processar saque')
      }
      
    } catch (error) {
      console.error('Erro ao processar saque:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar saque'
      
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
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <section className="fixed inset-0 z-50">
        <div className="relative z-10 flex items-start justify-center min-h-screen p-4 py-8 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#34D399]/30 rounded-2xl w-full max-w-md mx-auto shadow-2xl my-auto min-h-fit">
            <div className="relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={onClose}
                className="sticky top-4 right-4 float-right w-8 h-8 bg-[#222222] hover:bg-[#333333] rounded-full flex items-center justify-center text-white transition-all duration-300 z-20 mr-4 mt-4"
              >
                <i className="fa-solid fa-times text-sm"></i>
              </button>
              
              <div className="p-6 pt-2 pb-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Solicitar Saque</h2>
                  <p className="text-gray-400 text-sm">Retire seus ganhos de forma rápida e segura</p>
                </div>

                <div className="bg-[#222222] border border-[#34D399]/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Saldo disponível:</span>
                    <span className="text-[#34D399] font-bold text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(userBalance)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Valor do saque</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                      <input 
                        value={amount}
                        onChange={(e) => setAmount(formatCurrency(e.target.value))}
                        type="text" 
                        placeholder="0,00" 
                        required
                        className="w-full py-3 pl-10 pr-4 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#222222] placeholder-gray-500 focus:border-[#34D399] transition-all duration-300"
                      />
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      <i className="fa-solid fa-info-circle mr-1"></i>Mínimo: R$ 50,00
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Tipo de chave Pix</label>
                    <select 
                      value={pixType}
                      onChange={(e) => {
                        setPixType(e.target.value)
                        setPixKey('')
                      }}
                      required
                      className="w-full py-3 px-4 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#222222] focus:border-[#34D399] transition-all duration-300"
                    >
                      <option value="CPF">CPF</option>
                      <option value="E-MAIL">E-mail</option>
                      <option value="TELEFONE">Telefone</option>
                      <option value="ALEATORIA">Chave aleatória</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Chave Pix</label>
                    <input 
                      value={pixKey}
                      onChange={handlePixKeyChange}
                      type="text" 
                      placeholder={getPixKeyPlaceholder()}
                      required
                      className="w-full py-3 px-4 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#222222] placeholder-gray-500 focus:border-[#34D399] transition-all duration-300"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">Nome do beneficiário</label>
                    <input 
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      type="text" 
                      placeholder="Nome completo" 
                      required
                      className="w-full py-3 px-4 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#222222] placeholder-gray-500 focus:border-[#34D399] transition-all duration-300"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-2">CPF do beneficiário</label>
                    <input 
                      value={beneficiaryDocument}
                      onChange={(e) => setBeneficiaryDocument(formatCPF(e.target.value))}
                      type="text" 
                      placeholder="000.000.000-00" 
                      required
                      className="w-full py-3 px-4 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#222222] placeholder-gray-500 focus:border-[#34D399] transition-all duration-300"
                    />
                  </div>

                  <div className="mb-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#34D399] to-[#2cb27a] hover:from-[#2cb27a] hover:to-[#22a065] text-black font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 transform disabled:opacity-50"
                    >
                      <i className="fa-solid fa-money-bill-wave mr-2"></i>
                      {loading ? 'Processando...' : 'Solicitar Saque'}
                    </button>
                  </div>
                </form>

                <div className="bg-[#222222] border border-[#34D399]/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-info-circle text-[#34D399] text-sm"></i>
                    <span className="text-white text-sm font-medium">Informações importantes</span>
                  </div>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Saques são processados em até 24 horas</li>
                    <li>• Valor mínimo para saque: R$ 50,00</li>
                    <li>• Apenas um saque pendente por vez</li>
                    <li>• Verifique se os dados estão corretos antes de confirmar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
