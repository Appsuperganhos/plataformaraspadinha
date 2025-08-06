// Sistema de autenticação
const Auth = {
    // Verificar se usuário está logado
    isLoggedIn() {
        return Utils.storage.get(CONFIG.STORAGE_KEYS.USER_LOGGED) === 'true';
    },

    // Verificar se admin está logado
    isAdminLoggedIn() {
        return Utils.storage.get(CONFIG.STORAGE_KEYS.ADMIN_LOGGED) === 'true';
    },

    // Obter dados do usuário logado
    getCurrentUser() {
        if (this.isLoggedIn()) {
            return Utils.storage.get(CONFIG.STORAGE_KEYS.USER_DATA);
        }
        return null;
    },

    // Obter dados do admin logado
    getCurrentAdmin() {
        if (this.isAdminLoggedIn()) {
            return Utils.storage.get(CONFIG.STORAGE_KEYS.ADMIN_DATA);
        }
        return null;
    },

    // Login do usuário
    async login(email, password) {
        try {
            Utils.showLoading('Fazendo login...');
            
            const response = await API.login(email, password);
            
            if (response.success && response.usuario) {
                Utils.storage.set(CONFIG.STORAGE_KEYS.USER_LOGGED, 'true');
                Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, response.usuario);
                
                Utils.hideLoading();
                Utils.showNotification('success', 'Login realizado com sucesso!');
                
                // Atualizar interface
                this.updateAuthUI();
                
                return response;
            } else {
                throw new Error(response.mensagem || 'Erro ao fazer login');
            }
        } catch (error) {
            Utils.hideLoading();
            Utils.showNotification('error', error.message);
            throw error;
        }
    },

    // Registro do usuário
    async register(userData) {
        try {
            Utils.showLoading('Criando conta...');
            
            const response = await API.register(userData);
            
            if (response.success) {
                Utils.hideLoading();
                Utils.showNotification('success', 'Conta criada com sucesso!');
                return response;
            } else {
                throw new Error(response.mensagem || 'Erro ao criar conta');
            }
        } catch (error) {
            Utils.hideLoading();
            Utils.showNotification('error', error.message);
            throw error;
        }
    },

    // Login do admin
    async adminLogin(email, password) {
        try {
            Utils.showLoading('Fazendo login...');
            
            // Verificar credenciais de admin (hardcoded para demo)
            if (email === 'admin@raspouganhou.com' && password === 'admin123') {
                const adminData = {
                    id: 'admin',
                    email: email,
                    nome: 'Administrador',
                    role: 'admin'
                };
                
                Utils.storage.set(CONFIG.STORAGE_KEYS.ADMIN_LOGGED, 'true');
                Utils.storage.set(CONFIG.STORAGE_KEYS.ADMIN_DATA, adminData);
                
                Utils.hideLoading();
                Utils.showNotification('success', 'Login de admin realizado com sucesso!');
                
                return { success: true, admin: adminData };
            } else {
                throw new Error('Credenciais de admin inválidas');
            }
        } catch (error) {
            Utils.hideLoading();
            Utils.showNotification('error', error.message);
            throw error;
        }
    },

    // Logout do usuário
    logout() {
        Utils.storage.remove(CONFIG.STORAGE_KEYS.USER_LOGGED);
        Utils.storage.remove(CONFIG.STORAGE_KEYS.USER_DATA);
        
        this.updateAuthUI();
        Utils.showNotification('info', 'Logout realizado com sucesso!');
        
        // Redirecionar para home
        Router.navigate('/');
    },

    // Logout do admin
    adminLogout() {
        Utils.storage.remove(CONFIG.STORAGE_KEYS.ADMIN_LOGGED);
        Utils.storage.remove(CONFIG.STORAGE_KEYS.ADMIN_DATA);
        
        Utils.showNotification('info', 'Logout de admin realizado!');
        
        // Redirecionar para home
        Router.navigate('/');
    },

    // Atualizar saldo do usuário
    updateUserBalance(newBalance) {
        const user = this.getCurrentUser();
        if (user) {
            user.saldo = newBalance;
            Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, user);
            this.updateAuthUI();
        }
    },

    // Atualizar interface de autenticação
    updateAuthUI() {
        const headerRightSection = document.getElementById('headerRightSection');
        if (!headerRightSection) return;

        const user = this.getCurrentUser();
        
        if (user) {
            headerRightSection.innerHTML = this.getLoggedInHeaderHTML(user);
            this.attachLoggedInEvents();
        } else {
            headerRightSection.innerHTML = this.getLoggedOutHeaderHTML();
        }
    },

    // HTML para usuário logado
    getLoggedInHeaderHTML(user) {
        return `
            <div class="header-right-section-logged-in">
                <span class="balance-display">${Utils.formatCurrency(user.saldo)}</span>
                
                <button onclick="openDepositModal()" class="deposit-button">
                    <i class="fa-solid fa-plus"></i> Depositar
                </button>

                <div class="user-dropdown-container">
                    <button onclick="toggleUserMenu()" class="user-profile-button-logged-in">
                        <div class="user-avatar">${Utils.getInitials(user.nome)}</div>
                        <div class="user-info">
                            <span class="user-name-display">${user.nome.split(' ')[0]}</span>
                            <span class="view-profile-text">Ver perfil</span>
                        </div>
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>

                    <div id="userDropdownMenu" class="profile-dropdown-menu-logged-in">
                        <div class="dropdown-header">
                            <div class="dropdown-username">${user.nome}</div>
                            <div class="dropdown-welcome">Bem-vindo de volta!</div>
                        </div>
                        
                        <a href="/apostas" class="dropdown-menu-item-logged-in">
                            <i class="fa-solid fa-cart-shopping"></i>
                            Minhas Apostas
                        </a>
                        
                        <a href="/transacoes" class="dropdown-menu-item-logged-in">
                            <i class="fa-solid fa-receipt"></i>
                            Transações
                        </a>
                        
                        <button onclick="openWithdrawModal()" class="dropdown-menu-item-logged-in">
                            <i class="fa-solid fa-money-bill-wave"></i>
                            Sacar
                        </button>
                        
                        <a href="/afiliados" class="dropdown-menu-item-logged-in">
                            <i class="fa-solid fa-users"></i>
                            Afiliados
                        </a>
                        
                        <button onclick="Auth.logout()" class="dropdown-menu-item-logged-in logout-button-text-logged-in">
                            <i class="fa-solid fa-sign-out-alt"></i>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // HTML para usuário não logado
    getLoggedOutHeaderHTML() {
        return `
            <a href="/cadastro" class="register-link">
                <i class="fa-solid fa-user-plus"></i> Cadastrar
            </a>
            <a href="/login" class="login-button">
                Entrar <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </a>
        `;
    },

    // Anexar eventos para usuário logado
    attachLoggedInEvents() {
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdownMenu');
            const button = document.querySelector('.user-profile-button-logged-in');
            
            if (dropdown && button && !button.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
            }
        });
    },

    // Verificar permissões de admin
    requireAdmin() {
        if (!this.isAdminLoggedIn()) {
            Utils.showNotification('error', 'Acesso negado. Faça login como administrador.');
            Router.navigate('/admin/login');
            return false;
        }
        return true;
    },

    // Verificar se usuário está logado
    requireAuth() {
        if (!this.isLoggedIn()) {
            Utils.showNotification('info', 'Faça login para acessar esta página.');
            Router.navigate('/login');
            return false;
        }
        return true;
    }
};

// Funções globais para eventos
window.toggleUserMenu = function() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('is-open');
    }
};

window.openDepositModal = function() {
    if (Auth.isLoggedIn()) {
        Modals.openDepositModal();
    } else {
        Utils.showNotification('info', 'Faça login para depositar.');
        Router.navigate('/login');
    }
};

window.openWithdrawModal = function() {
    if (Auth.isLoggedIn()) {
        Modals.openWithdrawModal();
    } else {
        Utils.showNotification('info', 'Faça login para sacar.');
        Router.navigate('/login');
    }
};
