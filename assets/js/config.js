// Configurações da aplicação
const CONFIG = {
    API_BASE_URL: 'https://raspadinha-backend-i8kh.onrender.com',
    STORAGE_KEYS: {
        USER_LOGGED: 'usuarioLogado',
        USER_DATA: 'userData',
        ADMIN_LOGGED: 'adminLogado',
        ADMIN_DATA: 'adminData'
    },
    ROUTES: {
        HOME: '/',
        LOGIN: '/login',
        REGISTER: '/cadastro',
        DASHBOARD: '/dashboard',
        ADMIN: '/admin',
        ADMIN_LOGIN: '/admin/login',
        AFILIADOS: '/afiliados',
        TRANSACOES: '/transacoes',
        APOSTAS: '/apostas'
    },
    PAGINATION: {
        ITEMS_PER_PAGE: 10
    },
    VALIDATION: {
        MIN_DEPOSIT: 20,
        MAX_DEPOSIT: 5000,
        MIN_WITHDRAW: 50,
        MAX_WITHDRAW: 10000
    },
    PIX_TYPES: [
        { value: 'CPF', label: 'CPF' },
        { value: 'E-MAIL', label: 'E-mail' },
        { value: 'TELEFONE', label: 'Telefone' },
        { value: 'ALEATORIA', label: 'Chave Aleatória' }
    ],
    QUICK_AMOUNTS: [
        { value: 20, hasBonus: false },
        { value: 50, hasBonus: true },
        { value: 100, hasBonus: true },
        { value: 200, hasBonus: true }
    ],
    RASPADINHAS: [
        {
            id: 1,
            name: 'PRÊMIOS DE ATÉ R$ 1.000,00',
            price: 1.00,
            maxPrize: 1000.00,
            image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
            description: 'Raspe e ganhe prêmios incríveis em dinheiro!'
        },
        {
            id: 2,
            name: 'PRÊMIOS DE ATÉ R$ 2.000,00',
            price: 2.00,
            maxPrize: 2000.00,
            image: 'https://images.pexels.com/photos/6112388/pexels-photo-6112388.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
            description: 'Mais chances de ganhar com prêmios maiores!'
        },
        {
            id: 3,
            name: 'PIX na conta',
            price: 5.00,
            maxPrize: 5000.00,
            image: 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
            description: 'Ganhe e receba direto na sua conta!'
        },
        {
            id: 4,
            name: 'Super Prêmios',
            price: 50.00,
            maxPrize: 20000.00,
            image: 'https://images.pexels.com/photos/3683110/pexels-photo-3683110.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
            description: 'Os maiores prêmios da plataforma!'
        }
    ]
};

// Configuração do Notiflix
if (window.Notiflix) {
    Notiflix.Notify.init({
        position: 'right-top',
        distance: '83px',
        timeout: 3000,
        width: '300px',
        borderRadius: '8px',
        success: {
            background: '#34D399',
            textColor: '#ffffff'
        },
        failure: {
            background: '#EF4444',
            textColor: '#ffffff'
        },
        info: {
            background: '#3B82F6',
            textColor: '#ffffff'
        },
        warning: {
            background: '#F59E0B',
            textColor: '#ffffff'
        }
    });

    Notiflix.Loading.init({
        backgroundColor: 'rgba(0,0,0,0.8)',
        svgColor: '#34D399'
    });
}
