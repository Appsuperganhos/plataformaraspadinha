// Sistema de roteamento
const Router = {
    routes: {},
    currentRoute: '',

    // Inicializar roteador
    init() {
        // Definir rotas
        this.addRoute('/', () => Components.renderHomePage());
        this.addRoute('/login', () => Components.renderLoginPage());
        this.addRoute('/cadastro', () => Components.renderRegisterPage());
        this.addRoute('/transacoes', () => Components.renderTransactionsPage());
        this.addRoute('/apostas', () => Components.renderBetsPage());
        this.addRoute('/afiliados', () => Components.renderAffiliatePage());
        this.addRoute('/admin', () => Admin.renderDashboard());
        this.addRoute('/admin/login', () => Admin.renderLoginPage());
        this.addRoute('/admin/users', () => Admin.renderUsersPage());
        this.addRoute('/admin/transactions', () => Admin.renderTransactionsPage());
        this.addRoute('/admin/games', () => Admin.renderGamesPage());
        this.addRoute('/admin/stats', () => Admin.renderStatsPage());

        // Escutar mudanças na URL
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Interceptar cliques em links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigate(path);
            }
        });

        // Carregar rota inicial
        this.handleRoute();
    },

    // Adicionar rota
    addRoute(path, handler) {
        this.routes[path] = handler;
    },

    // Navegar para rota
    navigate(path) {
        if (path !== this.currentRoute) {
            history.pushState(null, '', path);
            this.handleRoute();
        }
    },

    // Processar rota atual
    handleRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;

        // Verificar se é rota de admin
        if (path.startsWith('/admin') && path !== '/admin/login') {
            if (!Auth.isAdminLoggedIn()) {
                this.navigate('/admin/login');
                return;
            }
        }

        // Encontrar handler da rota
        const handler = this.routes[path] || this.routes['/'];
        
        if (handler) {
            const content = handler();
            this.renderContent(content);
            this.attachEventListeners(path);
        }
    },

    // Renderizar conteúdo
    renderContent(content) {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = content;
        }
    },

    // Anexar event listeners específicos da página
    attachEventListeners(path) {
        switch (path) {
            case '/login':
                this.attachLoginEvents();
                break;
            case '/cadastro':
                this.attachRegisterEvents();
                break;
            case '/transacoes':
                this.attachTransactionsEvents();
                break;
            case '/admin/login':
                Admin.attachLoginEvents();
                break;
            case '/admin':
            case '/admin/users':
            case '/admin/transactions':
            case '/admin/games':
            case '/admin/stats':
                Admin.attachEvents();
                break;
        }
    },

    // Events da página de login
    attachLoginEvents() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                try {
                    await Auth.login(email, password);
                    this.navigate('/');
                } catch (error) {
                    // Erro já tratado no Auth.login
                }
            });
        }
    },

    // Events da página de registro
    attachRegisterEvents() {
        const form = document.getElementById('registerForm');
        if (form) {
            // Formatação de telefone
            const phoneInput = document.getElementById('registerPhone');
            phoneInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatPhone(e.target.value);
            });

            // Submit do formulário
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const nome = document.getElementById('registerName').value;
                const telefone = document.getElementById('registerPhone').value;
                const email = document.getElementById('registerEmail').value;
                const senha = document.getElementById('registerPassword').value;
                const confirmSenha = document.getElementById('registerConfirmPassword').value;
                const acceptTerms = document.getElementById('acceptTerms').checked;

                // Validações
                if (!nome.trim()) {
                    Utils.showNotification('error', 'Nome é obrigatório');
                    return;
                }

                if (!Utils.validatePhone(telefone)) {
                    Utils.showNotification('error', 'Telefone inválido');
                    return;
                }

                if (!Utils.validateEmail(email)) {
                    Utils.showNotification('error', 'E-mail inválido');
                    return;
                }

                if (senha.length < 6) {
                    Utils.showNotification('error', 'Senha deve ter pelo menos 6 caracteres');
                    return;
                }

                if (senha !== confirmSenha) {
                    Utils.showNotification('error', 'Senhas não coincidem');
                    return;
                }

                if (!acceptTerms) {
                    Utils.showNotification('error', 'Você deve aceitar os termos');
                    return;
                }

                try {
                    await Auth.register({ nome, telefone, email, senha });
                    this.navigate('/login');
                } catch (error) {
                    // Erro já tratado no Auth.register
                }
            });
        }
    },

    // Events da página de transações
    attachTransactionsEvents() {
        const filter = document.getElementById('transactionFilter');
        if (filter) {
            filter.addEventListener('change', () => {
                // Filtrar transações (implementar conforme necessário)
                console.log('Filtro selecionado:', filter.value);
            });
        }
    }
};
