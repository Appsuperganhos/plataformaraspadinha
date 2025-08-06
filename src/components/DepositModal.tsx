import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

interface DepositModalProps {
  onClose: () => void
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const { user, updateBalance } = useAuth()
  const [amount, setAmount] = useState('20,00')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  const quickAmounts = [
    { value: 20, hasBonus: false },
    { value: 50, hasBonus: true },
    { value: 80, hasBonus: true },
    { value: 200, hasBonus: true }
  ]

  const [selectedAmount, setSelectedAmount] = useState(20)

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setAmount(formatted)
    setSelectedAmount(0) // Deselect quick amounts
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toFixed(2).replace('.', ','))
    setSelectedAmount(value)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    const numericAmount = parseFloat(amount.replace(',', '.'))
    const cleanCPF = cpf.replace(/\D/g, '')

    if (numericAmount < 20) {
      alert('Valor mínimo é R$ 20,00')
      return
    }

    if (cleanCPF.length !== 11) {
      alert('CPF inválido')
      return
    }

    setLoading(true)

    try {
      // Usar sua API real de pagamento
      const response = await api.generatePix(numericAmount, cleanCPF)
      
      if (response.qrcode) {
        setQrCode(response.qrcode)
        setShowQR(true)
        
        // Polling para verificar pagamento
        const intervalId = setInterval(async () => {
          try {
            const consultData = await api.consultPix(response.qrcode)
            if (consultData.paid === true) {
              clearInterval(intervalId)
              
              // Calcular bônus
              const bonus = numericAmount >= 50 ? numericAmount : 0
              const newBalance = user.saldo + numericAmount + bonus
              updateBalance(newBalance)
              
              alert(`Pagamento aprovado! ${bonus > 0 ? `Bônus de R$ ${bonus.toFixed(2).replace('.', ',')} adicionado!` : ''}`)
              onClose()
            }
          } catch (error) {
            console.error('Erro no polling:', error)
            clearInterval(intervalId)
          }
        }, 2000)
      } else {
        throw new Error(response.message || 'Erro ao gerar QR Code')
      }
      
    } catch (error) {
      console.error('Erro ao processar depósito:', error)
      alert(error instanceof Error ? error.message : 'Erro ao processar depósito')
    } finally {
      setLoading(false)
    }
  }

  const copyQRCode = () => {
    navigator.clipboard.writeText(qrCode)
    // Usar notificação mais elegante se disponível
    if (window.Notiflix) {
      window.Notiflix.Notify.success('Código PIX copiado!')
    } else {
      alert('Código PIX copiado!')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <section className="fixed inset-0 z-50">
        <div className="deposit-modal-container">
          <div className="deposit-modal-content relative bg-gradient-to-br from-[#1A1A1A] to-[#0E1015] text-white border-l border-gray-800 fade-in">
            <button 
              onClick={onClose}
              className="absolute right-3 top-3 bg-gradient-to-r from-[#34D399] to-[#2cb27a] hover:from-[#2cb27a] hover:to-[#22a065] text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 z-20"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            
            <div className="pt-12">
              {!showQR ? (
                <>
                  <img 
                    src="https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=500&h=120&fit=crop" 
                    alt="Depósito" 
                    className="w-full rounded-xl mb-4 shadow-lg max-h-[120px] object-cover"
                  />
                  
                  <div className="bg-gradient-to-r from-[#1E2D3D] to-[#2a3441] p-2.5 rounded-xl flex items-center gap-2 mb-4 border border-[#34D399]/20">
                    <div className="w-5 h-5 bg-[#34D399] rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-shield-halved text-black text-xs"></i>
                    </div>
                    <span className="text-white text-xs">Pagamento seguro</span>
                  </div>
                  
                  <div className="quick-amount-grid grid grid-cols-2 gap-3">
                    {quickAmounts.map((item) => (
                      <button 
                        key={item.value}
                        type="button" 
                        onClick={() => handleQuickAmount(item.value)}
                        className={`quick-amount-new font-semibold py-4 px-3 rounded-xl transition-all duration-300 relative hover:scale-105 shadow-lg border border-gray-700 ${
                          selectedAmount === item.value 
                            ? 'bg-gradient-to-r from-[#34D399] to-[#2cb27a] text-black' 
                            : 'bg-gradient-to-r from-[#2a2a2a] to-[#1e1e1e] text-white'
                        }`}
                      >
                        {item.hasBonus && (
                          <span className="badge">
                            <i className="fa-solid fa-fire"></i>+100%
                          </span>
                        )}
                        <div className="text-base font-bold">R$ {item.value.toFixed(2).replace('.', ',')}</div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#1E2D3D] to-[#2a3441] p-2.5 rounded-xl flex items-center gap-2 mb-4 border border-[#34D399]/20">
                    <span className="text-white text-xs">Deposite R$ 50,00 ou mais e ganhe 100% de bônus no primeiro depósito!</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <i className="fa-solid fa-dollar-sign text-[#34D399] mr-2"></i>Valor do depósito
                      </label>
                      <input 
                        type="text" 
                        value={amount}
                        onChange={handleAmountChange}
                        required
                        className="deposit-input pl-12 pr-4 py-4 w-full rounded-xl text-white text-lg placeholder:text-gray-500 border-none focus:ring-0 focus:outline-none"
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <i className="fa-solid fa-id-card text-[#34D399] mr-2"></i>CPF do titular
                      </label>
                      <input 
                        type="text" 
                        value={cpf}
                        onChange={handleCPFChange}
                        required
                        maxLength={14}
                        className="deposit-input pl-16 pr-4 py-4 w-full rounded-xl text-white text-lg placeholder:text-gray-500 border-none focus:ring-0 focus:outline-none"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400 px-1">
                      <span><i className="fa-solid fa-info-circle mr-1"></i>Mínimo: R$ 20</span>
                      <span>Máximo: R$ 5.000,00</span>
                    </div>
                    
                    <div className="form-submit-section">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#34D399] to-[#2cb27a] hover:from-[#2cb27a] hover:to-[#22a065] text-black font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
                      >
                        <i className="fa-solid fa-qrcode text-lg"></i> 
                        <span className="text-lg">{loading ? 'Gerando...' : 'Gerar PIX Instantâneo'}</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center fade-in pb-8">
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#34D399] rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-check text-black text-sm"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-[#34D399]">PIX Gerado</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Escaneie o QR Code ou copie o código PIX</p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-[#34D399]/20">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`}
                        alt="QR Code" 
                        className="w-40 h-40 mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                        <i className="fa-solid fa-copy text-[#34D399] mr-2"></i>Código PIX Copia e Cola
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={qrCode}
                          readOnly
                          className="w-full py-3 pl-4 pr-24 rounded-xl text-white border-2 border-[#34D399]/30 bg-[#1a1a1a] text-sm font-mono focus:border-[#34D399] transition-all duration-300"
                        />
                        <button 
                          onClick={copyQRCode}
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#34D399] to-[#2cb27a] hover:from-[#2cb27a] hover:to-[#22a065] text-black px-3 py-1.5 rounded-lg cursor-pointer font-medium transition-all duration-300 hover:scale-105 text-sm"
                        >
                          <i className="fa-solid fa-copy mr-1"></i>Copiar
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-xl p-4 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-clock text-[#34D399] text-sm"></i>
                        <span className="text-white text-sm font-medium">Aguardando pagamento</span>
                      </div>
                      <p className="text-gray-400 text-xs">O pagamento será confirmado automaticamente após a aprovação</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
