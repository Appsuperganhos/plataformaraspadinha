# Plataforma Raspou Ganhou - Versão HTML/CSS/JavaScript

Uma plataforma completa de raspadinhas online desenvolvida em HTML, CSS e JavaScript puro, com área administrativa completa e integração com gateway de pagamento PIX.

## 🚀 Funcionalidades

### Para Usuários
- ✅ **Sistema de Autenticação Completo**
  - Cadastro com validação
  - Login seguro
  - Recuperação de senha
  - Perfil do usuário

- ✅ **Sistema de Saldo e Pagamentos**
  - Depósitos via PIX com QR Code
  - Saques via PIX
  - Histórico de transações
  - Sistema de bônus

- ✅ **Raspadinhas**
  - Múltiplos tipos de jogos
  - Diferentes valores de aposta
  - Sistema de prêmios
  - Histórico de apostas

- ✅ **Programa de Afiliados**
  - Link personalizado
  - Comissões automáticas
  - Dashboard de afiliados
  - Relatórios de ganhos

### Para Administradores
- ✅ **Dashboard Administrativo**
  - Estatísticas em tempo real
  - Gráficos e relatórios
  - Visão geral da plataforma

- ✅ **Gerenciamento de Usuários**
  - Lista completa de usuários
  - Busca e filtros
  - Bloqueio/desbloqueio
  - Histórico detalhado

- ✅ **Gerenciamento de Transações**
  - Aprovação de saques
  - Histórico completo
  - Filtros por tipo e status
  - Relatórios financeiros

- ✅ **Gerenciamento de Jogos**
  - Histórico de apostas
  - Estatísticas de jogos
  - Controle de prêmios

- ✅ **Estatísticas Avançadas**
  - Receita por período
  - Taxa de conversão
  - Usuários ativos
  - Gráficos detalhados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilização**: CSS Grid, Flexbox, Animações CSS
- **Ícones**: Font Awesome 6
- **Notificações**: Notiflix
- **Backend**: PHP (APIs de pagamento)
- **Armazenamento**: LocalStorage
- **Responsivo**: Mobile-first design

## 📁 Estrutura do Projeto

```
/
├── index.html              # Página principal
├── login.html              # Página de login
├── cadastro.html           # Página de cadastro
├── admin.html              # Painel administrativo
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos principais
│   └── js/
│       ├── config.js       # Configurações
│       ├── utils.js        # Utilitários
│       ├── auth.js         # Sistema de autenticação
│       ├── api.js          # Comunicação com APIs
│       ├── modals.js       # Sistema de modais
│       ├── components.js   # Componentes reutilizáveis
│       ├── router.js       # Sistema de rotas
│       ├── admin.js        # Funcionalidades admin
│       └── app.js          # Aplicação principal
├── api/
│   ├── payment.php         # API de pagamentos PIX
│   ├── consult_pix.php     # Consulta status PIX
│   └── withdraw_v2.php     # API de saques
└── README.md
```

## 🚀 Como Usar

### 1. Configuração Básica
1. Faça upload dos arquivos para seu servidor web
2. Configure as URLs da API no arquivo `assets/js/config.js`
3. Ajuste as credenciais de admin se necessário

### 2. Acesso de Usuário
- Acesse `index.html` para a página principal
- Cadastre-se em `cadastro.html`
- Faça login em `login.html`

### 3. Acesso Administrativo
- Acesse `admin.html`
- **Credenciais padrão:**
  - Email: `admin@raspouganhou.com`
  - Senha: `admin123`

## 🔧 Configuração

### Variáveis de Configuração (config.js)
```javascript
const CONFIG = {
    API_BASE_URL: 'https://seu-backend.com',
    VALIDATION: {
        MIN_DEPOSIT: 20,
        MAX_DEPOSIT: 5000,
        MIN_WITHDRAW: 50,
        MAX_WITHDRAW: 10000
    }
    // ... outras configurações
};
```

### Integração com Backend
O projeto inclui APIs PHP de exemplo para:
- Geração de PIX (`api/payment.php`)
- Consulta de pagamento (`api/consult_pix.php`)
- Processamento de saques (`api/withdraw_v2.php`)

## 🎨 Personalização

### Cores e Tema
As cores principais podem ser alteradas no arquivo CSS:
```css
:root {
    --primary-color: #34D399;
    --secondary-color: #00de93;
    --dark-bg-form: #1a1a1a;
    --darker-bg-form: #222222;
}
```

### Raspadinhas
Configure os jogos disponíveis em `config.js`:
```javascript
RASPADINHAS: [
    {
        id: 1,
        name: 'PRÊMIOS DE ATÉ R$ 1.000,00',
        price: 1.00,
        maxPrize: 1000.00,
        image: 'url-da-imagem'
    }
]
```

## 📱 Responsividade

O projeto é totalmente responsivo com:
- Design mobile-first
- Breakpoints otimizados
- Navegação móvel dedicada
- Interface adaptativa

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção contra XSS
- Headers de segurança configurados

## 🚀 Deploy

### Hospedagem Simples
1. Faça upload de todos os arquivos
2. Configure o servidor web (Apache/Nginx)
3. Ajuste as URLs das APIs
4. Teste todas as funcionalidades

### Hospedagem com SSL
- Configure certificado SSL
- Atualize URLs para HTTPS
- Teste pagamentos em ambiente seguro

## 📊 Funcionalidades Avançadas

### Sistema de Notificações
- Notificações em tempo real
- Diferentes tipos (sucesso, erro, info)
- Configuração personalizada

### Sistema de Modais
- Modais responsivos
- Animações suaves
- Fechamento inteligente

### Roteamento SPA
- Navegação sem reload
- URLs amigáveis
- Histórico do navegador

## 🔄 Atualizações Futuras

- [ ] Integração com Chart.js para gráficos
- [ ] Sistema de chat/suporte
- [ ] Notificações push
- [ ] PWA (Progressive Web App)
- [ ] Integração com mais gateways
- [ ] Sistema de níveis/gamificação

## 📞 Suporte

Para dúvidas ou suporte:
- Documentação completa no código
- Comentários explicativos
- Estrutura modular para fácil manutenção

## 📄 Licença

Este projeto é fornecido como está, para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ para a melhor experiência em raspadinhas online!**
