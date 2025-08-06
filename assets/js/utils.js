// Utilitários gerais
const Utils = {
    // Formatação de moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de CPF
    formatCPF(value) {
        const numericValue = value.replace(/\D/g, '').slice(0, 11);
        return numericValue
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },

    // Formatação de telefone
    formatPhone(value) {
        const numericValue = value.replace(/\D/g, '').slice(0, 11);
        if (numericValue.length <= 10) {
            return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            return numericValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
        }
    },

    // Formatação de valor monetário para input
    formatCurrencyInput(value) {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue) {
            const floatValue = parseInt(numericValue) / 100;
            return floatValue.toFixed(2).replace('.', ',');
        }
        return '0,00';
    },

    // Conversão de string monetária para número
    parseCurrency(value) {
        return parseFloat(value.replace(',', '.'));
    },

    // Validação de email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validação de CPF
    validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    },

    // Validação de telefone
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    },

    // Obter iniciais do nome
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    // Formatação de data
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },

    // Formatação de data e hora
    formatDateTime(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Debounce para otimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Copiar texto para clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    // Scroll suave para elemento
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Verificar se está em dispositivo móvel
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Sanitizar HTML
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Gerar cor aleatória
    generateRandomColor() {
        const colors = ['#34D399', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Calcular porcentagem
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1);
    },

    // Truncar texto
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    // Validar chave PIX
    validatePixKey(key, type) {
        switch (type) {
            case 'CPF':
                return this.validateCPF(key);
            case 'E-MAIL':
                return this.validateEmail(key);
            case 'TELEFONE':
                return this.validatePhone(key);
            case 'ALEATORIA':
                return key.length >= 32;
            default:
                return false;
        }
    },

    // Gerar QR Code URL
    generateQRCodeURL(data, size = 200) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    },

    // Mostrar notificação
    showNotification(type, message) {
        if (window.Notiflix) {
            switch (type) {
                case 'success':
                    Notiflix.Notify.success(message);
                    break;
                case 'error':
                    Notiflix.Notify.failure(message);
                    break;
                case 'info':
                    Notiflix.Notify.info(message);
                    break;
                case 'warning':
                    Notiflix.Notify.warning(message);
                    break;
            }
        } else {
            alert(message);
        }
    },

    // Mostrar loading
    showLoading(message = 'Carregando...') {
        if (window.Notiflix) {
            Notiflix.Loading.standard(message);
        }
    },

    // Esconder loading
    hideLoading() {
        if (window.Notiflix) {
            Notiflix.Loading.remove();
        }
    },

    // Armazenamento local
    storage: {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        
        get(key) {
            const item = localStorage.getItem(key);
            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },
        
        remove(key) {
            localStorage.removeItem(key);
        },
        
        clear() {
            localStorage.clear();
        }
    }
};
