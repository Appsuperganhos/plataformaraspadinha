import React from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const mockTransactions = [
    { id: 1, type: 'deposit', amount: 50, date: '2025-01-02', status: 'completed' },
    { id: 2, type: 'win', amount: 100, date: '2025-01-01', status: 'completed' },
    { id: 3, type: 'bet', amount: -15, date: '2024-12-31', status: 'completed' },
  ]

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222222] rounded-2xl p-6 mb-8 border border-[#34D399]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#34D399] rounded-full flex items-center justify-center text-black font-bold text-xl">
            {user.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Olá, {user.nome.split(' ')[0]}! 👋</h1>
            <p className="text-gray-400">Bem-vindo de volta à sua conta</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Saldo Card */}
        <div className="bg-gradient-to-br from-[#34D399] to-[#2cb27a] rounded-2xl p-6 text-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-sm font-medium">Saldo Total</p>
              <p className="text-2xl font-bold">{formatCurrency(user.saldo)}</p>
            </div>
            <i className="fa-solid fa-wallet text-3xl text-black/20"></i>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Raspadinhas Jogadas</p>
              <p className="text-xl font-bold text-white">0</p>
            </div>
            <i className="fa-solid fa-gamepad text-2xl text-[#34D399]"></i>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Prêmios Ganhos</p>
              <p className="text-xl font-bold text-white">R$ 0,00</p>
            </div>
            <i className="fa-solid fa-trophy text-2xl text-[#34D399]"></i>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => {/* Implementar abertura do modal de depósito */}}
          className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-xl p-4 hover:border-[#34D399]/50 transition-all duration-300 text-center"
        >
          <i className="fa-solid fa-plus text-[#34D399] text-xl mb-2"></i>
          <p className="text-white text-sm font-medium">Depositar</p>
        </button>
        
        <button 
          onClick={() => {/* Implementar abertura do modal de saque */}}
          className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-xl p-4 hover:border-[#34D399]/50 transition-all duration-300 text-center"
        >
          <i className="fa-solid fa-minus text-[#34D399] text-xl mb-2"></i>
          <p className="text-white text-sm font-medium">Sacar</p>
        </button>
        
        <a href="/cartelas" className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-xl p-4 hover:border-[#34D399]/50 transition-all duration-300 text-center">
          <i className="fa-solid fa-cart-shopping text-[#34D399] text-xl mb-2"></i>
          <p className="text-white text-sm font-medium">Raspadinhas</p>
        </a>
        
        <a href="/afiliados" className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-xl p-4 hover:border-[#34D399]/50 transition-all duration-300 text-center">
          <i className="fa-solid fa-users text-[#34D399] text-xl mb-2"></i>
          <p className="text-white text-sm font-medium">Afiliados</p>
        </a>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
        
        <div className="space-y-3">
          {mockTransactions.length > 0 ? mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#222222] rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' 
                    ? 'bg-[#34D399]/20 text-[#34D399]' 
                    : transaction.type === 'win'
                    ? 'bg-[#34D399]/20 text-[#34D399]'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <i className={`fa-solid ${
                    transaction.type === 'deposit' 
                      ? 'fa-plus' 
                      : transaction.type === 'win'
                      ? 'fa-trophy'
                      : 'fa-minus'
                  }`}></i>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {transaction.type === 'deposit' ? 'Depósito' : 
                     transaction.type === 'win' ? 'Prêmio' : 'Aposta'}
                  </p>
                  <p className="text-gray-400 text-sm">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.amount > 0 ? 'text-[#34D399]' : 'text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </p>
                <span className="text-xs text-gray-400 px-2 py-1 bg-[#34D399]/20 rounded-full">
                  {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <i className="fa-solid fa-receipt text-gray-600 text-3xl mb-4"></i>
              <p className="text-gray-400">Nenhuma transação ainda</p>
              <p className="text-gray-500 text-sm">Suas transações aparecerão aqui</p>
            </div>
          )}
        </div>

        {mockTransactions.length > 0 && (
          <div className="text-center mt-4">
            <a href="/transacoes" className="text-[#34D399] hover:underline text-sm">
              Ver todas as transações
            </a>
          </div>
        )}
      </div>
      
      {/* Raspadinhas em Destaque */}
      <div className="bg-[#1a1a1a] border border-[#34D399]/20 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Raspadinhas em Destaque</h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'PRÊMIOS DE ATÉ R$ 1.000,00', price: 'R$ 1,00', maxPrize: 'R$ 1.000,00' },
            { name: 'PIX na conta', price: 'R$ 5,00', maxPrize: 'R$ 5.000,00' },
            { name: 'Me mimei', price: 'R$ 10,00', maxPrize: 'R$ 10.000,00' },
            { name: 'Super Prêmios', price: 'R$ 50,00', maxPrize: 'R$ 20.000,00' },
          ].map((rasp, index) => (
            <div key={index} className="bg-[#222222] rounded-xl overflow-hidden group cursor-pointer hover:bg-[#2a2a2a] transition-all duration-300">
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-[#34D399] text-black font-bold px-2 py-1 rounded text-xs">
                    {rasp.price}
                  </span>
                </div>
                
                <img 
                  src={index === 0 ? 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop' :
                       index === 1 ? 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop' :
                       index === 2 ? 'https://images.pexels.com/photos/6112388/pexels-photo-6112388.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop' :
                       'https://images.pexels.com/photos/3683110/pexels-photo-3683110.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop'}
                  alt={rasp.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-3">
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">{rasp.name}</h4>
                <p className="text-[#34D399] text-xs font-medium mb-2">PRÊMIOS ATÉ {rasp.maxPrize}</p>
                <button className="w-full bg-[#34D399] text-black font-bold py-2 px-3 rounded-lg hover:bg-[#2cb27a] transition-all duration-300 text-xs">
                  Jogar Raspadinha <i className="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <a href="/transacoes" className="text-[#34D399] hover:underline text-sm">
            Ver todas as raspadinhas
          </a>
        </div>
      </div>
    </div>
  )
}
