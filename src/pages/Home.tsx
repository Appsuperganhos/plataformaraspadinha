import React from 'react'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-[#34D399] text-4xl mb-4"></i>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1a1a1a]">
        {user ? (
          <Dashboard />
        ) : (
          <div className="pt-20 px-4">
            {/* Hero Section for non-logged users */}
            <div className="max-w-[1200px] mx-auto text-center py-20">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Raspou <span className="text-[#34D399]">Ganhou</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                A maior e melhor plataforma de raspadinhas do Brasil. 
                Prêmios incríveis te esperam!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/cadastro" 
                  className="bg-[#34D399] text-black font-bold py-4 px-8 rounded-xl hover:bg-[#2cb27a] transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Cadastre-se Grátis
                </a>
                
                <a 
                  href="/login" 
                  className="bg-transparent border-2 border-[#34D399] text-[#34D399] font-bold py-4 px-8 rounded-xl hover:bg-[#34D399] hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-sign-in-alt"></i>
                  Já tenho conta
                </a>
              </div>
            </div>

            {/* Raspadinhas Preview */}
            <div className="max-w-[1200px] mx-auto px-4 pb-20">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Raspadinhas em Destaque
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'PRÊMIOS DE ATÉ R$ 1.000,00', price: 'R$ 1,00', maxPrize: 'R$ 1.000,00' },
                  { name: 'PRÊMIOS DE ATÉ R$ 2.000,00', price: 'R$ 2,00', maxPrize: 'R$ 2.000,00' },
                  { name: 'PIX na conta', price: 'R$ 5,00', maxPrize: 'R$ 5.000' },
                  { name: 'Super Prêmios', price: 'R$ 50,00', maxPrize: 'R$ 20.000,00' },
                ].map((rasp, index) => (
                  <div key={index} className="card-raspadinha bg-gradient-to-t from-[#222222] to-transparent rounded-2xl overflow-hidden group cursor-pointer">
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-[#34D399] text-black font-bold px-3 py-1 rounded-lg text-sm">
                          {rasp.price}
                        </span>
                      </div>
                      
                      <img 
                        src={index === 0 ? 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop' :
                             index === 1 ? 'https://images.pexels.com/photos/6112388/pexels-photo-6112388.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop' :
                             index === 2 ? 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop' :
                             'https://images.pexels.com/photos/3683110/pexels-photo-3683110.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'}
                        alt={rasp.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Logo sobreposto como na sua estrutura */}
                      <img 
                        src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=64&h=24&fit=crop"
                        alt="Raspou Ganhou Logo"
                        className="absolute bottom-3 right-3 w-16 h-auto opacity-80 rounded"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{rasp.name}</h3>
                      <p className="text-[#34D399] text-sm font-medium mb-2">PRÊMIOS ATÉ {rasp.maxPrize}</p>
                      <p className="text-gray-400 text-xs mb-4">
                        Raspe e ganhe prêmios incríveis em dinheiro!
                      </p>
                      
                      <button className="w-full bg-[#34D399] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#2cb27a] transition-all duration-300">
                        Jogar Raspadinha <i className="fa-solid fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
