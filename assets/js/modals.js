// Sistema de modais
const Modals = {
    // Container de modais
    container: null,

    // Inicializar sistema de modais
    init() {
        this.container = document.getElementById('modalsContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'modalsContainer';
            document.body.appendChild(this.container);
        }
    },

    // Criar modal base
    createModal(content, className = '') {
        const modal = document.createElement('div');
        modal.className = `modal-overlay ${className}`;
        modal.innerHTML = content;
        
        // Fechar modal ao clicar no overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        return modal;
    },

    // Abrir modal
    openModal(modal) {
        this.container.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animação de entrada
        setTimeout(() => {
            modal.classList.add('fade-in');
        }, 10);
    },

    // Fechar modal
    closeModal(modal) {
        document.body.style.overflow = '';
        modal.remove();
    },

    // Modal de depósito
    openDepositModal() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const content = `
            <div class="modal-content">
                <button onclick="Modals.closeModal(this.closest('.modal-overlay'))" class="modal-close">
                    <i class="fa-solid fa-times"></i>
                </button>
                
                <h2 class="modal-title">Fazer Depósito</h2>
                
                <div class="deposit-form-container">
                    <div class="quick-amount-grid">
                        ${CONFIG.QUICK_AMOUNTS.map(amount => `
                            <button type="button" class="quick-amount-btn" data-amount="${amount.value}">
                                ${amount.hasBonus ? '<span class="bonus-badge"><i class="fa-solid fa-fire"></i> +100%</span>' : ''}
                                <div>R$ ${amount.value.toFixed(2).replace('.', ',')}</div>
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="deposit-info">
                        <p><i class="fa-solid fa-info-circle"></i> Deposite R$ 50,00 ou mais e ganhe 100% de bônus!</p>
                    </div>
                    
                    <form id="depositForm">
                        <div class="form-group">
                            <label>Valor do depósito</label>
                            <div class="input-group">
                                <i class="fa-solid fa-dollar-sign"></i>
                                <input type="text" id="depositAmount" class="form-input" placeholder="0,00" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>CPF do titular</label>
                            <div class="input-group">
                                <i class="fa-solid fa-id-card"></i>
                                <input type="text" id="depositCPF" class="form-input" placeholder="000.000.000-00" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="form-button">
                            <i class="fa-solid fa-qrcode"></i>
                            Gerar PIX Instantâneo
                        </button>
                    </form>
                </div>
                
                <div id="qrCodeDisplay" class="qr-display hidden">
                    <div class="qr-success">
                        <i class="fa-solid fa-check-circle"></i>
                        <h3>PIX Gerado com Sucesso!</h3>
                        <p>Escaneie o QR Code ou copie o código PIX</p>
                    </div>
                    
                    <div class="qr-code-container">
                        <img id="qrCodeImage" src="" alt="QR Code">
                    </div>
                    
                    <div class="pix-code-input">
                        <label>Código PIX Copia e Cola</label>
                        <input type="text" id="pixCode" readonly>
                        <button type="button" class="copy-button" onclick="Modals.copyPixCode()">
                            <i class="fa-solid fa-copy"></i> Copiar
                        </button>
                    </div>
                    
                    <div class="payment-status">
                        <div class="status-header">
                            <i class="fa-solid fa-clock"></i>
                            <span class="status-text">Aguardando pagamento</span>
                        </div>
                        <p class="status-description">O pagamento será confirmado automaticamente</p>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createModal(content);
        this.openModal(modal);
        this.initDepositModal();
    },

    // Inicializar modal de depósito
    initDepositModal() {
        // Botões de valor rápido
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                const amount = btn.dataset.amount;
                document.getElementById('depositAmount').value = parseFloat(amount).toFixed(2).replace('.', ',');
            });
        });

        // Formatação do valor
        const amountInput = document.getElementById('depositAmount');
        amountInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCurrencyInput(e.target.value);
            // Remover seleção dos botões rápidos
            document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('selected'));
        });

        // Formatação do CPF
        const cpfInput = document.getElementById('depositCPF');
        cpfInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCPF(e.target.value);
        });

        // Submit do formulário
        document.getElementById('depositForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processDeposit();
        });
    },

    // Processar depósito
    async processDeposit() {
        const amount = Utils.parseCurrency(document.getElementById('depositAmount').value);
        const cpf = document.getElementById('depositCPF').value.replace(/\D/g, '');

        if (amount < CONFIG.VALIDATION.MIN_DEPOSIT) {
            Utils.showNotification('error', `Valor mínimo é ${Utils.formatCurrency(CONFIG.VALIDATION.MIN_DEPOSIT)}`);
            return;
        }

        if (amount > CONFIG.VALIDATION.MAX_DEPOSIT) {
            Utils.showNotification('error', `Valor máximo é ${Utils.formatCurrency(CONFIG.VALIDATION.MAX_DEPOSIT)}`);
            return;
        }

        if (!Utils.validateCPF(cpf)) {
            Utils.showNotification('error', 'CPF inválido');
            return;
        }

        try {
            Utils.showLoading('Gerando PIX...');
            
            const response = await API.generatePix(amount, cpf);
            
            Utils.hideLoading();
            
            if (response.qrcode) {
                this.showQRCode(response.qrcode, amount);
                this.startPaymentPolling(response.qrcode, amount);
            } else {
                throw new Error(response.message || 'Erro ao gerar PIX');
            }
        } catch (error) {
            Utils.hideLoading();
            Utils.showNotification('error', error.message);
        }
    },

    // Mostrar QR Code
    showQRCode(qrcode, amount) {
        document.querySelector('.deposit-form-container').classList.add('hidden');
        
        const qrDisplay = document.getElementById('qrCodeDisplay');
        qrDisplay.classList.remove('hidden');
        
        document.getElementById('qrCodeImage').src = Utils.generateQRCodeURL(qrcode);
        document.getElementById('pixCode').value = qrcode;
    },

    // Copiar código PIX
    async copyPixCode() {
        const pixCode = document.getElementById('pixCode').value;
        const success = await Utils.copyToClipboard(pixCode);
        
        if (success) {
            Utils.showNotification('success', 'Código PIX copiado!');
        }
    },

    // Polling para verificar pagamento
    startPaymentPolling(qrcode, amount) {
        const intervalId = setInterval(async () => {
            try {
                const response = await API.consultPix(qrcode);
                
                if (response.paid === true) {
                    clearInterval(intervalId);
                    
                    // Calcular bônus
                    const bonus = amount >= 50 ? amount : 0;
                    const user = Auth.getCurrentUser();
                    const newBalance = user.saldo + amount + bonus;
                    
                    Auth.updateUserBalance(newBalance);
                    
                    Utils.showNotification('success', 
                        `Pagamento aprovado! ${bonus > 0 ? `Bônus de ${Utils.formatCurrency(bonus)} adicionado!` : ''}`
                    );
                    
                    // Fechar modal
                    document.querySelector('.modal-overlay').remove();
                    document.body.style.overflow = '';
                }
            } catch (error) {
                console.error('Erro no polling:', error);
                clearInterval(intervalId);
            }
        }, 3000);

        // Parar polling após 10 minutos
        setTimeout(() => {
            clearInterval(intervalId);
        }, 600000);
    },

    // Modal de saque
    openWithdrawModal() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const content = `
            <div class="modal-content">
                <button onclick="Modals.closeModal(this.closest('.modal-overlay'))" class="modal-close">
                    <i class="fa-solid fa-times"></i>
                </button>
                
                <h2 class="modal-title">Solicitar Saque</h2>
                
                <div class="balance-info">
                    <div class="balance-card">
                        <span>Saldo disponível:</span>
                        <strong>${Utils.formatCurrency(user.saldo)}</strong>
                    </div>
                </div>
                
                <form id="withdrawForm">
                    <div class="form-group">
                        <label>Valor do saque</label>
                        <div class="input-group">
                            <i class="fa-solid fa-dollar-sign"></i>
                            <input type="text" id="withdrawAmount" class="form-input" placeholder="0,00" required>
                        </div>
                        <small>Mínimo: ${Utils.formatCurrency(CONFIG.VALIDATION.MIN_WITHDRAW)}</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Tipo de chave PIX</label>
                        <select id="pixType" class="form-input" required>
                            ${CONFIG.PIX_TYPES.map(type => 
                                `<option value="${type.value}">${type.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Chave PIX</label>
                        <div class="input-group">
                            <i class="fa-solid fa-key"></i>
                            <input type="text" id="pixKey" class="form-input" placeholder="Digite sua chave PIX" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Nome do beneficiário</label>
                        <div class="input-group">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" id="beneficiaryName" class="form-input" value="${user.nome}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>CPF do beneficiário</label>
                        <div class="input-group">
                            <i class="fa-solid fa-id-card"></i>
                            <input type="text" id="beneficiaryDocument" class="form-input" placeholder="000.000.000-00" required>
                        </div>
                    </div>
                    
                    <div class="withdraw-info">
                        <h4><i class="fa-solid fa-info-circle"></i> Informações importantes</h4>
                        <ul>
                            <li>Saques são processados em até 24 horas</li>
                            <li>Valor mínimo: ${Utils.formatCurrency(CONFIG.VALIDATION.MIN_WITHDRAW)}</li>
                            <li>Apenas um saque pendente por vez</li>
                            <li>Verifique se os dados estão corretos</li>
                        </ul>
                    </div>
                    
                    <button type="submit" class="form-button">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        Solicitar Saque
                    </button>
                </form>
            </div>
        `;

        const modal = this.createModal(content);
        this.openModal(modal);
        this.initWithdrawModal();
    },

    // Inicializar modal de saque
    initWithdrawModal() {
        // Formatação do valor
        const amountInput = document.getElementById('withdrawAmount');
        amountInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCurrencyInput(e.target.value);
        });

        // Formatação do CPF
        const documentInput = document.getElementById('beneficiaryDocument');
        documentInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCPF(e.target.value);
        });

        // Formatação da chave PIX baseada no tipo
        const pixTypeSelect = document.getElementById('pixType');
        const pixKeyInput = document.getElementById('pixKey');

        pixTypeSelect.addEventListener('change', () => {
            pixKeyInput.value = '';
            this.updatePixKeyPlaceholder();
        });

        pixKeyInput.addEventListener('input', (e) => {
            const pixType = pixTypeSelect.value;
            
            if (pixType === 'CPF') {
                e.target.value = Utils.formatCPF(e.target.value);
            } else if (pixType === 'TELEFONE') {
                e.target.value = Utils.formatPhone(e.target.value);
            }
        });

        // Submit do formulário
        document.getElementById('withdrawForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processWithdraw();
        });

        // Definir placeholder inicial
        this.updatePixKeyPlaceholder();
    },

    // Atualizar placeholder da chave PIX
    updatePixKeyPlaceholder() {
        const pixType = document.getElementById('pixType').value;
        const pixKeyInput = document.getElementById('pixKey');
        
        const placeholders = {
            'CPF': '000.000.000-00',
            'E-MAIL': 'seu@email.com',
            'TELEFONE': '(11) 99999-9999',
            'ALEATORIA': 'Chave aleatória de 32 caracteres'
        };
        
        pixKeyInput.placeholder = placeholders[pixType] || 'Digite sua chave PIX';
    },

    // Processar saque
    async processWithdraw() {
        const user = Auth.getCurrentUser();
        const amount = Utils.parseCurrency(document.getElementById('withdrawAmount').value);
        const pixType = document.getElementById('pixType').value;
        const pixKey = document.getElementById('pixKey').value;
        const beneficiaryName = document.getElementById('beneficiaryName').value;
        const beneficiaryDocument = document.getElementById('beneficiaryDocument').value.replace(/\D/g, '');

        // Validações
        if (amount < CONFIG.VALIDATION.MIN_WITHDRAW) {
            Utils.showNotification('error', `Valor mínimo é ${Utils.formatCurrency(CONFIG.VALIDATION.MIN_WITHDRAW)}`);
            return;
        }

        if (amount > user.saldo) {
            Utils.showNotification('error', 'Valor maior que o saldo disponível');
            return;
        }

        if (!Utils.validatePixKey(pixKey, pixType)) {
            Utils.showNotification('error', 'Chave PIX inválida');
            return;
        }

        if (!Utils.validateCPF(beneficiaryDocument)) {
            Utils.showNotification('error', 'CPF do beneficiário inválido');
            return;
        }

        try {
            Utils.showLoading('Processando saque...');
            
            const response = await API.withdraw({
                amount,
                pixKey,
                pixType,
                beneficiaryName,
                beneficiaryDocument
            });
            
            Utils.hideLoading();
            
            if (response.success) {
                const newBalance = user.saldo - amount;
                Auth.updateUserBalance(newBalance);
                
                Utils.showNotification('success', response.message || 'Saque solicitado com sucesso!');
                
                // Fechar modal
                document.querySelector('.modal-overlay').remove();
                document.body.style.overflow = '';
            } else {
                throw new Error(response.message || 'Erro ao processar saque');
            }
        } catch (error) {
            Utils.hideLoading();
            Utils.showNotification('error', error.message);
        }
    }
};
