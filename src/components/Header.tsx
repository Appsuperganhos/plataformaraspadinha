import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

export default function Header() {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getUserInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      <header className="header-main">
        <div className="header-content-wrapper">
          <div className="header-left-section">
            <a href="/" className="header-logo-link">
              <img 
                src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=200&h=60&fit=crop" 
                className="header-logo" 
                alt="Logo" 
              />
            </a>
            <a href="/" className="header-rasp-link">Raspadinhas</a>
          </div>

          <div className="header-right-section">
            {user ? (
              <div className="header-right-section-logged-in">
                <span className="balance-display">
                  {formatCurrency(user.saldo)}
                </span>
                
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="deposit-button"
                >
                  <i className="fa-solid fa-plus"></i> Depositar
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-profile-button-logged-in"
                  >
                    <div className="user-avatar">
                      {getUserInitials(user.nome)}
                    </div>
                    <div className="user-info">
                      <span className="user-name-display">{user.nome.split(' ')[0]}</span>
                      <span className="view-profile-text">Ver perfil</span>
                    </div>
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>

                  {showUserMenu && (
                    <div className="profile-dropdown-menu-logged-in is-open">
                      <div className="dropdown-header">
                        <div className="dropdown-username">{user.nome}</div>
                        <div className="dropdown-welcome">Bem-vindo de volta!</div>
                      </div>
                      
                      <a href="/apostas" className="dropdown-menu-item-logged-in">
                        <i className="fa-solid fa-cart-shopping"></i>
                        Minhas Apostas
                      </a>
                      
                      <a href="/transacoes" className="dropdown-menu-item-logged-in">
                        <i className="fa-solid fa-receipt"></i>
                        Transações
                      </a>
                      
                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="dropdown-menu-item-logged-in"
                      >
                        <i className="fa-solid fa-money-bill-wave"></i>
                        Sacar
                      </button>
                      
                      <a href="/afiliados" className="dropdown-menu-item-logged-in">
                        <i className="fa-solid fa-users"></i>
                        Afiliados
                      </a>
                      
                      <button 
                        onClick={signOut}
                        className="dropdown-menu-item-logged-in logout-button-text-logged-in"
                      >
                        <i className="fa-solid fa-sign-out-alt"></i>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <a href="/cadastro" className="register-link">
                  <i className="fa-solid fa-user-plus"></i> Cadastrar
                </a>
                <a href="/login" className="login-button">
                  Entrar <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <a href="/" className="mobile-nav-item">
          <i className="fa-solid fa-gamepad"></i>
        </a>
        <a href="/apostas" className="mobile-nav-item">
          <i className="fa-solid fa-cart-shopping"></i>
        </a>
        <button 
          onClick={() => setShowDepositModal(true)} 
          className="mobile-nav-item mobile-nav-item-highlight"
        >
          <i className="fa-solid fa-wallet"></i>
        </button>
        <a href="/afiliados" className="mobile-nav-item">
          <i className="fa-solid fa-gift"></i>
        </a>
        <a href="/transacoes" className="mobile-nav-item">
          <i className="fa-solid fa-receipt"></i>
        </a>
      </nav>

      {/* Modals */}
      {showDepositModal && (
        <DepositModal 
          onClose={() => setShowDepositModal(false)}
        />
      )}
      
      {showWithdrawModal && user && (
        <WithdrawModal 
          onClose={() => setShowWithdrawModal(false)}
          userBalance={user.saldo}
          userName={user.nome}
        />
      )}
    </>
  )
}
