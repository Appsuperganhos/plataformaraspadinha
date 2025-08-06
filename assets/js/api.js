// API para comunicação com o backend
const API = {
    // Fazer requisição HTTP
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            
            return {
                success: response.ok,
                data: data,
                status: response.status,
                mensagem: data.mensagem || data.message
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                mensagem: 'Erro de conexão com o servidor'
            };
        }
    },

    // Login
    async login(email, senha) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        return {
            success: response.success,
            mensagem: response.mensagem,
            usuario: response.data?.usuario
        };
    },

    // Registro
    async register({ nome, email, senha, telefone }) {
        const response = await this.request('/cadastro', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha, telefone })
        });

        return {
            success: response.success,
            mensagem: response.mensagem
        };
    },

    // Gerar PIX para depósito
    async generatePix(amount, cpf) {
        try {
            const response = await fetch('/api/payment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    amount: amount.toString(),
                    cpf: cpf
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('PIX Generation Error:', error);
            return {
                success: false,
                message: 'Erro ao gerar PIX'
            };
        }
    },

    // Consultar status do PIX
    async consultPix(qrcode) {
        try {
            const response = await fetch('/api/consult_pix.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ qrcode })
            });
            
            return await response.json();
        } catch (error) {
            console.error('PIX Consult Error:', error);
            return {
                success: false,
                paid: false
            };
        }
    },

    // Solicitar saque
    async withdraw(data) {
        try {
            const response = await fetch('/api/withdraw_v2.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Withdraw Error:', error);
            return {
                success: false,
                message: 'Erro ao processar saque'
            };
        }
    },

    // Obter estatísticas do usuário
    async getUserStats(userId) {
        // Mock data para demonstração
        return {
            success: true,
            data: {
                totalDeposits: 500.00,
                totalWithdraws: 200.00,
                totalBets: 150.00,
                totalWins: 75.00,
                gamesPlayed: 25,
                winRate: 30.5,
                affiliateEarnings: 50.00,
                affiliateCount: 3
            }
        };
    },

    // Obter transações do usuário
    async getUserTransactions(userId, page = 1) {
        // Mock data para demonstração
        const transactions = [
            {
                id: 1,
                type: 'deposit',
                amount: 50.00,
                status: 'completed',
                date: new Date().toISOString(),
                description: 'Depósito via PIX'
            },
            {
                id: 2,
                type: 'bet',
                amount: -5.00,
                status: 'completed',
                date: new Date(Date.now() - 86400000).toISOString(),
                description: 'Raspadinha PIX na conta'
            },
            {
                id: 3,
                type: 'win',
                amount: 25.00,
                status: 'completed',
                date: new Date(Date.now() - 172800000).toISOString(),
                description: 'Prêmio - Raspadinha'
            }
        ];

        return {
            success: true,
            data: {
                transactions,
                totalPages: 1,
                currentPage: page
            }
        };
    },

    // Obter apostas do usuário
    async getUserBets(userId, page = 1) {
        // Mock data para demonstração
        const bets = [
            {
                id: 1,
                gameId: 1,
                gameName: 'PRÊMIOS DE ATÉ R$ 1.000,00',
                amount: 5.00,
                result: 'win',
                prize: 25.00,
                date: new Date().toISOString(),
                status: 'completed'
            },
            {
                id: 2,
                gameId: 2,
                gameName: 'PIX na conta',
                amount: 10.00,
                result: 'lose',
                prize: 0,
                date: new Date(Date.now() - 86400000).toISOString(),
                status: 'completed'
            }
        ];

        return {
            success: true,
            data: {
                bets,
                totalPages: 1,
                currentPage: page
            }
        };
    },

    // APIs do Admin
    admin: {
        // Obter estatísticas gerais
        async getStats() {
            // Mock data para demonstração
            return {
                success: true,
                data: {
                    totalUsers: 1250,
                    activeUsers: 890,
                    totalDeposits: 125000.00,
                    totalWithdraws: 75000.00,
                    totalBets: 95000.00,
                    totalWins: 45000.00,
                    platformProfit: 50000.00,
                    conversionRate: 15.5,
                    averageDeposit: 85.50,
                    averageWithdraw: 125.00
                }
            };
        },

        // Obter usuários
        async getUsers(page = 1, search = '') {
            // Mock data para demonstração
            const users = [
                {
                    id: 1,
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '(11) 99999-9999',
                    saldo: 150.50,
                    totalDeposits: 500.00,
                    totalWithdraws: 200.00,
                    status: 'active',
                    createdAt: '2024-01-15',
                    lastLogin: '2024-01-20'
                },
                {
                    id: 2,
                    nome: 'Maria Santos',
                    email: 'maria@email.com',
                    telefone: '(11) 88888-8888',
                    saldo: 75.25,
                    totalDeposits: 300.00,
                    totalWithdraws: 100.00,
                    status: 'active',
                    createdAt: '2024-01-10',
                    lastLogin: '2024-01-19'
                }
            ];

            return {
                success: true,
                data: {
                    users,
                    totalPages: 5,
                    currentPage: page,
                    totalUsers: 1250
                }
            };
        },

        // Obter transações
        async getTransactions(page = 1, type = 'all') {
            // Mock data para demonstração
            const transactions = [
                {
                    id: 1,
                    userId: 1,
                    userName: 'João Silva',
                    type: 'deposit',
                    amount: 100.00,
                    status: 'completed',
                    date: new Date().toISOString(),
                    description: 'Depósito via PIX'
                },
                {
                    id: 2,
                    userId: 2,
                    userName: 'Maria Santos',
                    type: 'withdraw',
                    amount: 50.00,
                    status: 'pending',
                    date: new Date(Date.now() - 3600000).toISOString(),
                    description: 'Saque via PIX'
                }
            ];

            return {
                success: true,
                data: {
                    transactions,
                    totalPages: 10,
                    currentPage: page
                }
            };
        },

        // Obter jogos/apostas
        async getGames(page = 1) {
            // Mock data para demonstração
            const games = [
                {
                    id: 1,
                    userId: 1,
                    userName: 'João Silva',
                    gameType: 'PRÊMIOS DE ATÉ R$ 1.000,00',
                    betAmount: 5.00,
                    result: 'win',
                    prize: 25.00,
                    date: new Date().toISOString(),
                    status: 'completed'
                },
                {
                    id: 2,
                    userId: 2,
                    userName: 'Maria Santos',
                    gameType: 'PIX na conta',
                    betAmount: 10.00,
                    result: 'lose',
                    prize: 0,
                    date: new Date(Date.now() - 1800000).toISOString(),
                    status: 'completed'
                }
            ];

            return {
                success: true,
                data: {
                    games,
                    totalPages: 15,
                    currentPage: page
                }
            };
        },

        // Atualizar status de transação
        async updateTransactionStatus(transactionId, status) {
            // Mock response
            return {
                success: true,
                message: 'Status da transação atualizado com sucesso'
            };
        },

        // Bloquear/desbloquear usuário
        async toggleUserStatus(userId) {
            // Mock response
            return {
                success: true,
                message: 'Status do usuário atualizado com sucesso'
            };
        }
    }
};
