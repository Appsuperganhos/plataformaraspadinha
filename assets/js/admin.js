// Sistema de administração
const Admin = {
    currentPage: 'dashboard',

    // Renderizar dashboard do admin
    renderDashboard() {
        if (!Auth.requireAdmin()) return '';

        return `
            <div class="admin-container fade-in">
                ${this.renderAdminHeader()}
                ${this.renderAdminNav()}
                
                <div class="admin-content">
                    <div id="adminStats">
                        ${this.renderStatsCards()}
                    </div>
                    
                    <div class="charts-container">
                        <div class="chart-card">
                            <h3 class="chart-title">Receita dos Últimos 7 Dias</h3>
                            <div id="revenueChart" class="chart-placeholder">
                                <p>Gráfico de receita (implementar com Chart.js)</p>
                            </div>
                        </div>
                        
                        <div class="chart-card">
                            <h3 class="chart-title">Novos Usuários</h3>
                            <div id="usersChart" class="chart-placeholder">
                                <p>Gráfico de usuários (implementar com Chart.js)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="recent-activity">
                        <h3 class="section-title">Atividade Recente</h3>
                        <div id="adminRecentActivity">
                            ${this.renderRecentActivity()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Header do admin
    renderAdminHeader() {
        const admin = Auth.getCurrentAdmin();
        
        return `
            <div class="admin-header">
                <h1 class="admin-title">Painel Administrativo</h1>
                <p class="admin-subtitle">Bem-vindo, ${admin.nome}</p>
                <button onclick="Auth.adminLogout()" class="btn-secondary">
                    <i class="fa-solid fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;
    },

    // Navegação do admin
    renderAdminNav() {
        const navItems = [
            { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard', path: '/admin' },
            { id: 'users', icon: 'fa-users', label: 'Usuários', path: '/admin/users' },
            { id: 'transactions', icon: 'fa-exchange-alt', label: 'Transações', path: '/admin/transactions' },
            { id: 'games', icon: 'fa-gamepad', label: 'Jogos', path: '/admin/games' },
            { id: 'stats', icon: 'fa-chart-bar', label: 'Estatísticas', path: '/admin/stats' }
        ];

        return `
            <div class="admin-nav">
                ${navItems.map(item => `
                    <a href="${item.path}" class="admin-nav-item ${this.currentPage === item.id ? 'active' : ''}">
                        <i class="fa-solid ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
        `;
    },

    // Cards de estatísticas
    renderStatsCards() {
        // Mock data - em produção, buscar da API
        const stats = {
            totalUsers: 1250,
            activeUsers: 890,
            totalRevenue: 125000.00,
            todayRevenue: 2500.00,
            totalDeposits: 95000.00,
            totalWithdraws: 45000.00,
            pendingWithdraws: 5000.00,
            conversionRate: 15.5
        };

        return `
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-header">
                        <span class="stat-label">Receita Total</span>
                        <i class="fa-solid fa-dollar-sign stat-icon"></i>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(stats.totalRevenue)}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Usuários Totais</span>
                        <i class="fa-solid fa-users stat-icon"></i>
                    </div>
                    <div class="stat-value">${stats.totalUsers.toLocaleString()}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Usuários Ativos</span>
                        <i class="fa-solid fa-user-check stat-icon"></i>
                    </div>
                    <div class="stat-value">${stats.activeUsers.toLocaleString()}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Receita Hoje</span>
                        <i class="fa-solid fa-calendar-day stat-icon"></i>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(stats.todayRevenue)}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Total Depósitos</span>
                        <i class="fa-solid fa-arrow-down stat-icon"></i>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(stats.totalDeposits)}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Total Saques</span>
                        <i class="fa-solid fa-arrow-up stat-icon"></i>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(stats.totalWithdraws)}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Saques Pendentes</span>
                        <i class="fa-solid fa-clock stat-icon"></i>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(stats.pendingWithdraws)}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-label">Taxa Conversão</span>
                        <i class="fa-solid fa-percentage stat-icon"></i>
                    </div>
                    <div class="stat-value">${stats.conversionRate}%</div>
                </div>
            </div>
        `;
    },

    // Atividade recente do admin
    renderRecentActivity() {
        // Mock data
        const activities = [
            {
                type: 'user_register',
                description: 'Novo usuário cadastrado: João Silva',
                date: new Date(),
                icon: 'fa-user-plus',
                color: 'success'
            },
            {
                type: 'deposit',
                description: 'Depósito de R$ 100,00 - Maria Santos',
                date: new Date(Date.now() - 1800000),
                icon: 'fa-arrow-down',
                color: 'info'
            },
            {
                type: 'withdraw_request',
                description: 'Solicitação de saque de R$ 50,00 - Pedro Costa',
                date: new Date(Date.now() - 3600000),
                icon: 'fa-arrow-up',
                color: 'warning'
            }
        ];

        return `
            <div class="activity-list">
                ${activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-left">
                            <div class="activity-icon ${activity.color}">
                                <i class="fa-solid ${activity.icon}"></i>
                            </div>
                            <div class="activity-info">
                                <h4>${activity.description}</h4>
                                <p>${Utils.formatDateTime(activity.date)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Página de login do admin
    renderLoginPage() {
        return `
            <div class="form-container fade-in">
                <div class="form-header">
                    <img src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=60&fit=crop" 
                         alt="Logo" class="form-logo">
                    <h2 class="form-title">Acesso Administrativo</h2>
                    <p class="form-subtitle">Entre com suas credenciais de administrador</p>
                </div>

                <form id="adminLoginForm">
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" id="adminEmail" class="form-input" placeholder="E-mail do administrador" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-lock"></i>
                            <input type="password" id="adminPassword" class="form-input" placeholder="Senha" required>
                        </div>
                    </div>

                    <button type="submit" class="form-button">
                        <i class="fa-solid fa-shield-alt"></i>
                        Entrar como Admin
                    </button>
                </form>

                <div class="form-link">
                    <a href="/">← Voltar ao site</a>
                </div>

                <div class="admin-demo-info">
                    <p><strong>Demo:</strong></p>
                    <p>Email: admin@raspouganhou.com</p>
                    <p>Senha: admin123</p>
                </div>
            </div>
        `;
    },

    // Página de usuários
    renderUsersPage() {
        if (!Auth.requireAdmin()) return '';

        return `
            <div class="admin-container fade-in">
                ${this.renderAdminHeader()}
                ${this.renderAdminNav()}
                
                <div class="admin-content">
                    <div class="section-header">
                        <h2><i class="fa-solid fa-users"></i> Gerenciar Usuários</h2>
                        <div class="section-actions">
                            <input type="text" id="userSearch" class="form-input" placeholder="Buscar usuários..." style="width: 300px;">
                            <button class="btn-primary" onclick="Admin.exportUsers()">
                                <i class="fa-solid fa-download"></i> Exportar
                            </button>
                        </div>
                    </div>

                    <div id="usersTable">
                        ${this.renderUsersTable()}
                    </div>
                </div>
            </div>
        `;
    },

    // Tabela de usuários
    renderUsersTable() {
        // Mock data
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

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Saldo</th>
                            <th>Total Depósitos</th>
                            <th>Total Saques</th>
                            <th>Status</th>
                            <th>Cadastro</th>
                            <th>Último Login</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>#${user.id}</td>
                                <td>${user.nome}</td>
                                <td>${user.email}</td>
                                <td>${user.telefone}</td>
                                <td>${Utils.formatCurrency(user.saldo)}</td>
                                <td>${Utils.formatCurrency(user.totalDeposits)}</td>
                                <td>${Utils.formatCurrency(user.totalWithdraws)}</td>
                                <td>
                                    <span class="status-badge ${user.status}">
                                        ${user.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td>${Utils.formatDate(user.createdAt)}</td>
                                <td>${Utils.formatDate(user.lastLogin)}</td>
                                <td>
                                    <button class="btn-sm btn-primary" onclick="Admin.viewUser(${user.id})">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button class="btn-sm btn-warning" onclick="Admin.toggleUserStatus(${user.id})">
                                        <i class="fa-solid fa-ban"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Página de transações
    renderTransactionsPage() {
        if (!Auth.requireAdmin()) return '';

        return `
            <div class="admin-container fade-in">
                ${this.renderAdminHeader()}
                ${this.renderAdminNav()}
                
                <div class="admin-content">
                    <div class="section-header">
                        <h2><i class="fa-solid fa-exchange-alt"></i> Gerenciar Transações</h2>
                        <div class="section-actions">
                            <select id="transactionTypeFilter" class="form-input">
                                <option value="all">Todas</option>
                                <option value="deposit">Depósitos</option>
                                <option value="withdraw">Saques</option>
                                <option value="bet">Apostas</option>
                                <option value="win">Prêmios</option>
                            </select>
                            <select id="transactionStatusFilter" class="form-input">
                                <option value="all">Todos Status</option>
                                <option value="pending">Pendente</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div id="transactionsTable">
                        ${this.renderTransactionsTable()}
                    </div>
                </div>
            </div>
        `;
    },

    // Tabela de transações
    renderTransactionsTable() {
        // Mock data
        const transactions = [
            {
                id: 1,
                userId: 1,
                userName: 'João Silva',
                type: 'deposit',
                amount: 100.00,
                status: 'completed',
                date: new Date(),
                description: 'Depósito via PIX'
            },
            {
                id: 2,
                userId: 2,
                userName: 'Maria Santos',
                type: 'withdraw',
                amount: 50.00,
                status: 'pending',
                date: new Date(Date.now() - 3600000),
                description: 'Saque via PIX'
            }
        ];

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.map(transaction => `
                            <tr>
                                <td>#${transaction.id}</td>
                                <td>${transaction.userName}</td>
                                <td>
                                    <span class="transaction-type ${transaction.type}">
                                        <i class="fa-solid fa-${this.getTransactionIcon(transaction.type)}"></i>
                                        ${this.getTransactionTypeText(transaction.type)}
                                    </span>
                                </td>
                                <td class="${transaction.amount > 0 ? 'text-success' : 'text-error'}">
                                    ${Utils.formatCurrency(Math.abs(transaction.amount))}
                                </td>
                                <td>
                                    <span class="status-badge ${transaction.status}">
                                        ${this.getStatusText(transaction.status)}
                                    </span>
                                </td>
                                <td>${Utils.formatDateTime(transaction.date)}</td>
                                <td>${transaction.description}</td>
                                <td>
                                    ${transaction.status === 'pending' ? `
                                        <button class="btn-sm btn-success" onclick="Admin.approveTransaction(${transaction.id})">
                                            <i class="fa-solid fa-check"></i>
                                        </button>
                                        <button class="btn-sm btn-error" onclick="Admin.rejectTransaction(${transaction.id})">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    ` : `
                                        <button class="btn-sm btn-primary" onclick="Admin.viewTransaction(${transaction.id})">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                    `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Página de jogos
    renderGamesPage() {
        if (!Auth.requireAdmin()) return '';

        return `
            <div class="admin-container fade-in">
                ${this.renderAdminHeader()}
                ${this.renderAdminNav()}
                
                <div class="admin-content">
                    <div class="section-header">
                        <h2><i class="fa-solid fa-gamepad"></i> Gerenciar Jogos</h2>
                    </div>

                    <div id="gamesTable">
                        ${this.renderGamesTable()}
                    </div>
                </div>
            </div>
        `;
    },

    // Tabela de jogos
    renderGamesTable() {
        // Mock data
        const games = [
            {
                id: 1,
                userId: 1,
                userName: 'João Silva',
                gameType: 'PRÊMIOS DE ATÉ R$ 1.000,00',
                betAmount: 5.00,
                result: 'win',
                prize: 25.00,
                date: new Date(),
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
                date: new Date(Date.now() - 1800000),
                status: 'completed'
            }
        ];

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Jogo</th>
                            <th>Aposta</th>
                            <th>Resultado</th>
                            <th>Prêmio</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${games.map(game => `
                            <tr>
                                <td>#${game.id}</td>
                                <td>${game.userName}</td>
                                <td>${game.gameType}</td>
                                <td>${Utils.formatCurrency(game.betAmount)}</td>
                                <td>
                                    <span class="result-badge ${game.result}">
                                        <i class="fa-solid fa-${game.result === 'win' ? 'trophy' : 'times'}"></i>
                                        ${game.result === 'win' ? 'Ganhou' : 'Perdeu'}
                                    </span>
                                </td>
                                <td class="${game.prize > 0 ? 'text-success' : 'text-gray'}">
                                    ${game.prize > 0 ? Utils.formatCurrency(game.prize) : '-'}
                                </td>
                                <td>${Utils.formatDateTime(game.date)}</td>
                                <td>
                                    <span class="status-badge ${game.status}">
                                        ${this.getStatusText(game.status)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Página de estatísticas
    renderStatsPage() {
        if (!Auth.requireAdmin()) return '';

        return `
            <div class="admin-container fade-in">
                ${this.renderAdminHeader()}
                ${this.renderAdminNav()}
                
                <div class="admin-content">
                    <div class="section-header">
                        <h2><i class="fa-solid fa-chart-bar"></i> Estatísticas Detalhadas</h2>
                    </div>

                    ${this.renderStatsCards()}
                    
                    <div class="charts-container">
                        <div class="chart-card">
                            <h3 class="chart-title">Receita por Mês</h3>
                            <div class="chart-placeholder">
                                <p>Gráfico de receita mensal (implementar com Chart.js)</p>
                            </div>
                        </div>
                        
                        <div class="chart-card">
                            <h3 class="chart-title">Usuários por Dia</h3>
                            <div class="chart-placeholder">
                                <p>Gráfico de novos usuários (implementar com Chart.js)</p>
                            </div>
                        </div>
                        
                        <div class="chart-card">
                            <h3 class="chart-title">Jogos por Categoria</h3>
                            <div class="chart-placeholder">
                                <p>Gráfico de pizza dos jogos (implementar com Chart.js)</p>
                            </div>
                        </div>
                        
                        <div class="chart-card">
                            <h3 class="chart-title">Taxa de Conversão</h3>
                            <div class="chart-placeholder">
                                <p>Gráfico de conversão (implementar com Chart.js)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Event listeners do admin
    attachLoginEvents() {
        const form = document.getElementById('adminLoginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('adminEmail').value;
                const password = document.getElementById('adminPassword').value;

                try {
                    await Auth.adminLogin(email, password);
                    Router.navigate('/admin');
                } catch (error) {
                    // Erro já tratado no Auth.adminLogin
                }
            });
        }
    },

    // Event listeners gerais do admin
    attachEvents() {
        // Busca de usuários
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', Utils.debounce((e) => {
                this.searchUsers(e.target.value);
            }, 300));
        }

        // Filtros de transação
        const typeFilter = document.getElementById('transactionTypeFilter');
        const statusFilter = document.getElementById('transactionStatusFilter');
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }
    },

    // Métodos de ação do admin
    viewUser(userId) {
        Utils.showNotification('info', `Visualizar usuário #${userId} (implementar modal)`);
    },

    toggleUserStatus(userId) {
        Utils.showNotification('info', `Alterar status do usuário #${userId} (implementar)`);
    },

    approveTransaction(transactionId) {
        Utils.showNotification('success', `Transação #${transactionId} aprovada (implementar)`);
    },

    rejectTransaction(transactionId) {
        Utils.showNotification('error', `Transação #${transactionId} rejeitada (implementar)`);
    },

    viewTransaction(transactionId) {
        Utils.showNotification('info', `Visualizar transação #${transactionId} (implementar modal)`);
    },

    searchUsers(query) {
        console.log('Buscar usuários:', query);
        // Implementar busca de usuários
    },

    filterTransactions() {
        const type = document.getElementById('transactionTypeFilter')?.value;
        const status = document.getElementById('transactionStatusFilter')?.value;
        console.log('Filtrar transações:', { type, status });
        // Implementar filtros
    },

    exportUsers() {
        Utils.showNotification('info', 'Exportando usuários... (implementar)');
    },

    // Utilitários
    getTransactionIcon(type) {
        const icons = {
            deposit: 'arrow-down',
            withdraw: 'arrow-up',
            bet: 'gamepad',
            win: 'trophy'
        };
        return icons[type] || 'circle';
    },

    getTransactionTypeText(type) {
        const texts = {
            deposit: 'Depósito',
            withdraw: 'Saque',
            bet: 'Aposta',
            win: 'Prêmio'
        };
        return texts[type] || type;
    },

    getStatusText(status) {
        const texts = {
            completed: 'Concluído',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    }
};
