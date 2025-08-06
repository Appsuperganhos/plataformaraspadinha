// Componentes reutilizáveis
const Components = {
    // Renderizar página inicial
    renderHomePage() {
        const user = Auth.getCurrentUser();
        
        if (user) {
            return this.renderDashboard(user);
        } else {
            return this.renderLandingPage();
        }
    },

    // Página de landing para usuários não logados
    renderLandingPage() {
        return `
            <div class="hero-section fade-in">
                <h1 class="hero-title">
                    Raspou <span style="color: var(--primary-color)">Ganhou</span>
                </h1>
                <p class="hero-subtitle">
                    A maior e melhor plataforma de raspadinhas do Brasil. 
                    Prêmios incríveis te esperam!
                </p>
                
                <div class="hero-buttons">
                    <a href="/cadastro" class="btn-primary">
                        <i class="fa-solid fa-user-plus"></i>
                        Cadastre-se Grátis
                    </a>
                    
                    <a href="/login" class="btn-secondary">
                        <i class="fa-solid fa-sign-in-alt"></i>
                        Já tenho conta
                    </a>
                </div>
            </div>

            <div class="section-title text-center mb-30">
                <h2>Raspadinhas em Destaque</h2>
            </div>
            
            <div class="cards-grid">
                ${this.renderRaspasCards()}
            </div>
        `;
    },

    // Dashboard do usuário
    renderDashboard(user) {
        return `
            <div class="dashboard-container fade-in">
                <div class="welcome-section">
                    <div class="welcome-header">
                        <div class="welcome-avatar">${Utils.getInitials(user.nome)}</div>
                        <div class="welcome-text">
                            <h1>Olá, ${user.nome.split(' ')[0]}! 👋</h1>
                            <p>Bem-vindo de volta à sua conta</p>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-header">
                            <span class="stat-label">Saldo Total</span>
                            <i class="fa-solid fa-wallet stat-icon"></i>
                        </div>
                        <div class="stat-value">${Utils.formatCurrency(user.saldo)}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Raspadinhas Jogadas</span>
                            <i class="fa-solid fa-gamepad stat-icon"></i>
                        </div>
                        <div class="stat-value">0</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Prêmios Ganhos</span>
                            <i class="fa-solid fa-trophy stat-icon"></i>
                        </div>
                        <div class="stat-value">R$ 0,00</div>
                    </div>
                </div>

                <div class="quick-actions">
                    <button onclick="openDepositModal()" class="quick-action">
                        <i class="fa-solid fa-plus"></i>
                        <span>Depositar</span>
                    </button>
                    
                    <button onclick="openWithdrawModal()" class="quick-action">
                        <i class="fa-solid fa-minus"></i>
                        <span>Sacar</span>
                    </button>
                    
                    <a href="/apostas" class="quick-action">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span>Minhas Apostas</span>
                    </a>
                    
                    <a href="/afiliados" class="quick-action">
                        <i class="fa-solid fa-users"></i>
                        <span>Afiliados</span>
                    </a>
                </div>

                <div class="recent-activity">
                    <h3 class="section-title">Atividade Recente</h3>
                    <div id="recentActivityList">
                        ${this.renderActivityList()}
                    </div>
                </div>

                <div class="recent-activity mt-30">
                    <h3 class="section-title">Raspadinhas em Destaque</h3>
                    <div class="cards-grid">
                        ${this.renderRaspasCards(true)}
                    </div>
                </div>
            </div>
        `;
    },

    // Cards das raspadinhas
    renderRaspasCards(compact = false) {
        return CONFIG.RASPADINHAS.map(rasp => `
            <div class="card-raspadinha">
                <div class="card-image">
                    <div class="card-price-tag">${Utils.formatCurrency(rasp.price)}</div>
                    <img src="${rasp.image}" alt="${rasp.name}">
                </div>
                
                <div class="card-content">
                    <h3 class="card-title">${rasp.name}</h3>
                    <p class="card-prize">PRÊMIOS ATÉ ${Utils.formatCurrency(rasp.maxPrize)}</p>
                    ${!compact ? `<p class="card-description">${rasp.description}</p>` : ''}
                    
                    <button class="card-button" onclick="Components.playGame(${rasp.id})">
                        Jogar Raspadinha <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Lista de atividades
    renderActivityList() {
        // Mock data para demonstração
        const activities = [
            {
                type: 'deposit',
                amount: 50.00,
                description: 'Depósito via PIX',
                date: new Date(),
                status: 'completed'
            },
            {
                type: 'win',
                amount: 25.00,
                description: 'Prêmio - Raspadinha',
                date: new Date(Date.now() - 86400000),
                status: 'completed'
            },
            {
                type: 'bet',
                amount: -5.00,
                description: 'Raspadinha PIX na conta',
                date: new Date(Date.now() - 172800000),
                status: 'completed'
            }
        ];

        if (activities.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fa-solid fa-receipt"></i>
                    <h3>Nenhuma atividade ainda</h3>
                    <p>Suas transações aparecerão aqui</p>
                </div>
            `;
        }

        return `
            <div class="activity-list">
                ${activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-left">
                            <div class="activity-icon ${activity.type}">
                                <i class="fa-solid fa-${this.getActivityIcon(activity.type)}"></i>
                            </div>
                            <div class="activity-info">
                                <h4>${activity.description}</h4>
                                <p>${Utils.formatDateTime(activity.date)}</p>
                            </div>
                        </div>
                        <div class="activity-right">
                            <div class="activity-amount ${activity.amount > 0 ? 'positive' : 'negative'}">
                                ${activity.amount > 0 ? '+' : ''}${Utils.formatCurrency(Math.abs(activity.amount))}
                            </div>
                            <span class="activity-status">${this.getStatusText(activity.status)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="text-center mt-20">
                <a href="/transacoes" class="text-primary">Ver todas as transações</a>
            </div>
        `;
    },

    // Ícone da atividade
    getActivityIcon(type) {
        const icons = {
            deposit: 'plus',
            withdraw: 'minus',
            bet: 'gamepad',
            win: 'trophy'
        };
        return icons[type] || 'circle';
    },

    // Texto do status
    getStatusText(status) {
        const texts = {
            completed: 'Concluído',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    },

    // Página de login
    renderLoginPage() {
        return `
            <div class="form-container fade-in">
                <div class="form-header">
                    <img src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=60&fit=crop" 
                         alt="Logo" class="form-logo">
                    <h2 class="form-title">Acesse sua conta</h2>
                    <p class="form-subtitle">Entre e continue jogando suas raspadinhas favoritas</p>
                </div>

                <form id="loginForm">
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" id="loginEmail" class="form-input" placeholder="E-mail" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-lock"></i>
                            <input type="password" id="loginPassword" class="form-input" placeholder="Senha" required>
                        </div>
                    </div>

                    <button type="submit" class="form-button">
                        Entrar <i class="fa-solid fa-arrow-right-to-bracket"></i>
                    </button>
                </form>

                <div class="form-link">
                    <p>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
                </div>

                <div class="form-link">
                    <a href="/recuperar-senha">Esqueceu sua senha?</a>
                </div>
            </div>
        `;
    },

    // Página de registro
    renderRegisterPage() {
        return `
            <div class="form-container fade-in">
                <div class="form-header">
                    <img src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=60&fit=crop" 
                         alt="Logo" class="form-logo">
                    <h2 class="form-title">Crie sua conta gratuita</h2>
                    <p class="form-subtitle">Vamos começar?</p>
                </div>

                <form id="registerForm">
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" id="registerName" class="form-input" placeholder="Nome completo" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-phone"></i>
                            <input type="text" id="registerPhone" class="form-input" placeholder="Telefone" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" id="registerEmail" class="form-input" placeholder="E-mail" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-lock"></i>
                            <input type="password" id="registerPassword" class="form-input" placeholder="Senha" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="input-group">
                            <i class="fa-solid fa-shield-alt"></i>
                            <input type="password" id="registerConfirmPassword" class="form-input" placeholder="Confirmar senha" required>
                        </div>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="acceptTerms" required>
                        <label for="acceptTerms">
                            Declaro que tenho mais de 18 anos e aceito os 
                            <a href="/termos" target="_blank">Termos</a> e 
                            <a href="/privacidade" target="_blank">Políticas de Privacidade</a>
                        </label>
                    </div>

                    <button type="submit" class="form-button">
                        Criar conta <i class="fa-solid fa-user-plus"></i>
                    </button>
                </form>

                <div class="form-link">
                    <p>Já tem uma conta? <a href="/login">Conecte-se</a></p>
                </div>
            </div>
        `;
    },

    // Página de transações
    renderTransactionsPage() {
        if (!Auth.requireAuth()) return '';

        return `
            <div class="fade-in">
                <div class="section-title mb-30">
                    <h2><i class="fa-solid fa-receipt"></i> Minhas Transações</h2>
                </div>

                <div class="filters-container mb-20">
                    <select id="transactionFilter" class="form-input" style="width: auto; display: inline-block;">
                        <option value="all">Todas as transações</option>
                        <option value="deposit">Depósitos</option>
                        <option value="withdraw">Saques</option>
                        <option value="bet">Apostas</option>
                        <option value="win">Prêmios</option>
                    </select>
                </div>

                <div id="transactionsList">
                    ${this.renderTransactionsList()}
                </div>
            </div>
        `;
    },

    // Lista de transações
    renderTransactionsList() {
        // Mock data para demonstração
        const transactions = [
            {
                id: 1,
                type: 'deposit',
                amount: 100.00,
                status: 'completed',
                date: new Date(),
                description: 'Depósito via PIX'
            },
            {
                id: 2,
                type: 'bet',
                amount: -5.00,
                status: 'completed',
                date: new Date(Date.now() - 3600000),
                description: 'Raspadinha PIX na conta'
            },
            {
                id: 3,
                type: 'win',
                amount: 25.00,
                status: 'completed',
                date: new Date(Date.now() - 7200000),
                description: 'Prêmio - Raspadinha'
            }
        ];

        if (transactions.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fa-solid fa-receipt"></i>
                    <h3>Nenhuma transação encontrada</h3>
                    <p>Suas transações aparecerão aqui</p>
                </div>
            `;
        }

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.map(transaction => `
                            <tr>
                                <td>${Utils.formatDateTime(transaction.date)}</td>
                                <td>
                                    <span class="transaction-type ${transaction.type}">
                                        <i class="fa-solid fa-${this.getActivityIcon(transaction.type)}"></i>
                                        ${this.getTransactionTypeText(transaction.type)}
                                    </span>
                                </td>
                                <td>${transaction.description}</td>
                                <td class="${transaction.amount > 0 ? 'text-success' : 'text-error'}">
                                    ${transaction.amount > 0 ? '+' : ''}${Utils.formatCurrency(Math.abs(transaction.amount))}
                                </td>
                                <td>
                                    <span class="status-badge ${transaction.status}">
                                        ${this.getStatusText(transaction.status)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Texto do tipo de transação
    getTransactionTypeText(type) {
        const texts = {
            deposit: 'Depósito',
            withdraw: 'Saque',
            bet: 'Aposta',
            win: 'Prêmio'
        };
        return texts[type] || type;
    },

    // Página de apostas
    renderBetsPage() {
        if (!Auth.requireAuth()) return '';

        return `
            <div class="fade-in">
                <div class="section-title mb-30">
                    <h2><i class="fa-solid fa-cart-shopping"></i> Minhas Apostas</h2>
                </div>

                <div id="betsList">
                    ${this.renderBetsList()}
                </div>
            </div>
        `;
    },

    // Lista de apostas
    renderBetsList() {
        // Mock data para demonstração
        const bets = [
            {
                id: 1,
                gameName: 'PRÊMIOS DE ATÉ R$ 1.000,00',
                amount: 5.00,
                result: 'win',
                prize: 25.00,
                date: new Date(),
                status: 'completed'
            },
            {
                id: 2,
                gameName: 'PIX na conta',
                amount: 10.00,
                result: 'lose',
                prize: 0,
                date: new Date(Date.now() - 86400000),
                status: 'completed'
            }
        ];

        if (bets.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fa-solid fa-gamepad"></i>
                    <h3>Nenhuma aposta ainda</h3>
                    <p>Suas apostas aparecerão aqui</p>
                    <a href="/" class="btn-primary mt-20">Jogar Raspadinhas</a>
                </div>
            `;
        }

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Jogo</th>
                            <th>Aposta</th>
                            <th>Resultado</th>
                            <th>Prêmio</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bets.map(bet => `
                            <tr>
                                <td>${Utils.formatDateTime(bet.date)}</td>
                                <td>${bet.gameName}</td>
                                <td>${Utils.formatCurrency(bet.amount)}</td>
                                <td>
                                    <span class="result-badge ${bet.result}">
                                        <i class="fa-solid fa-${bet.result === 'win' ? 'trophy' : 'times'}"></i>
                                        ${bet.result === 'win' ? 'Ganhou' : 'Perdeu'}
                                    </span>
                                </td>
                                <td class="${bet.prize > 0 ? 'text-success' : 'text-gray'}">
                                    ${bet.prize > 0 ? Utils.formatCurrency(bet.prize) : '-'}
                                </td>
                                <td>
                                    <span class="status-badge ${bet.status}">
                                        ${this.getStatusText(bet.status)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Página de afiliados
    renderAffiliatePage() {
        if (!Auth.requireAuth()) return '';

        const user = Auth.getCurrentUser();
        const affiliateLink = `${window.location.origin}/?ref=${user.id}`;

        return `
            <div class="fade-in">
                <div class="section-title mb-30">
                    <h2><i class="fa-solid fa-users"></i> Programa de Afiliados</h2>
                </div>

                <div class="stats-grid mb-30">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Afiliados Ativos</span>
                            <i class="fa-solid fa-users stat-icon"></i>
                        </div>
                        <div class="stat-value">0</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Comissões Ganhas</span>
                            <i class="fa-solid fa-dollar-sign stat-icon"></i>
                        </div>
                        <div class="stat-value">R$ 0,00</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Este Mês</span>
                            <i class="fa-solid fa-calendar stat-icon"></i>
                        </div>
                        <div class="stat-value">R$ 0,00</div>
                    </div>
                </div>

                <div class="affiliate-link-section mb-30">
                    <h3>Seu Link de Afiliado</h3>
                    <div class="pix-code-input">
                        <input type="text" value="${affiliateLink}" readonly>
                        <button type="button" class="copy-button" onclick="Components.copyAffiliateLink('${affiliateLink}')">
                            <i class="fa-solid fa-copy"></i> Copiar
                        </button>
                    </div>
                    <p class="text-gray">Compartilhe este link e ganhe 10% de comissão sobre os depósitos dos seus afiliados!</p>
                </div>

                <div class="affiliate-info">
                    <h3>Como Funciona</h3>
                    <div class="info-cards">
                        <div class="info-card">
                            <i class="fa-solid fa-share"></i>
                            <h4>1. Compartilhe</h4>
                            <p>Compartilhe seu link de afiliado com amigos e conhecidos</p>
                        </div>
                        <div class="info-card">
                            <i class="fa-solid fa-user-plus"></i>
                            <h4>2. Cadastro</h4>
                            <p>Quando alguém se cadastrar pelo seu link, vira seu afiliado</p>
                        </div>
                        <div class="info-card">
                            <i class="fa-solid fa-money-bill"></i>
                            <h4>3. Ganhe</h4>
                            <p>Receba 10% de comissão sobre todos os depósitos dos seus afiliados</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Copiar link de afiliado
    async copyAffiliateLink(link) {
        const success = await Utils.copyToClipboard(link);
        if (success) {
            Utils.showNotification('success', 'Link de afiliado copiado!');
        }
    },

    // Jogar jogo (placeholder)
    playGame(gameId) {
        if (!Auth.isLoggedIn()) {
            Utils.showNotification('info', 'Faça login para jogar.');
            Router.navigate('/login');
            return;
        }

        const game = CONFIG.RASPADINHAS.find(r => r.id === gameId);
        if (!game) return;

        const user = Auth.getCurrentUser();
        if (user.saldo < game.price) {
            Utils.showNotification('error', 'Saldo insuficiente para jogar esta raspadinha.');
            return;
        }

        // Simular jogo (placeholder)
        Utils.showNotification('info', `Jogando ${game.name}... (Funcionalidade em desenvolvimento)`);
    }
};
