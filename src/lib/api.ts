// API configuration to work with your existing backend
const API_BASE_URL = 'https://raspadinha-backend-i8kh.onrender.com'

export interface LoginResponse {
  success: boolean
  mensagem: string
  usuario?: {
    id: string
    nome: string
    email: string
    saldo: number
  }
}

export interface RegisterResponse {
  success: boolean
  mensagem: string
}

export const api = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })
    
    const data = await response.json()
    return {
      success: response.ok,
      mensagem: data.mensagem,
      usuario: data.usuario
    }
  },

  async register(nome: string, email: string, senha: string, telefone?: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha, telefone })
    })
    
    const data = await response.json()
    return {
      success: response.ok,
      mensagem: data.mensagem
    }
  },

  async generatePix(amount: number, cpf: string) {
    const response = await fetch('/api/payment.php', {
      method: 'POST',
      body: new URLSearchParams({
        amount: amount.toString(),
        cpf: cpf
      })
    })
    
    return await response.json()
  },

  async consultPix(qrcode: string) {
    const response = await fetch('/api/consult_pix.php', {
      method: 'POST',
      body: new URLSearchParams({ qrcode })
    })
    
    return await response.json()
  },

  async withdraw(data: {
    amount: number
    pixKey: string
    pixType: string
    beneficiaryName: string
    beneficiaryDocument: string
  }) {
    const response = await fetch('/api/withdraw_v2.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    return await response.json()
  }
}
