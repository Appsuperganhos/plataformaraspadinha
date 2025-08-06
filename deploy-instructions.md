# Como fazer deploy na Hostinger

## Passos para colocar o projeto na sua pasta public_html:

### 1. Build do projeto (já executado)
O comando `npm run build` criou uma pasta `dist/` com todos os arquivos otimizados para produção.

### 2. Preparar os arquivos para upload
Você precisa fazer upload do conteúdo da pasta `dist/` para sua pasta `public_html` na Hostinger.

### 3. Estrutura de arquivos após o build:
```
dist/
├── index.html (arquivo principal)
├── assets/
│   ├── index-[hash].js (JavaScript compilado)
│   └── index-[hash].css (CSS compilado)
└── vite.svg (favicon)
```

### 4. Opções de integração:

#### Opção A: Substituir completamente (Recomendado para novo projeto)
1. Faça backup dos seus arquivos atuais
2. Delete o conteúdo atual da pasta `public_html`
3. Faça upload de todo o conteúdo da pasta `dist/` para `public_html`

#### Opção B: Integrar com estrutura existente
1. Renomeie seu `index.html` atual para `index-old.html`
2. Faça upload do conteúdo da pasta `dist/` para `public_html`
3. Se necessário, ajuste os caminhos dos seus outros arquivos HTML

### 5. Configurações importantes:

#### Variáveis de ambiente (.env)
Você precisa configurar as variáveis do Supabase:
- `VITE_SUPABASE_URL=sua_url_do_supabase`
- `VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase`

#### Configuração do servidor (se necessário)
Para SPAs (Single Page Applications), você pode precisar configurar redirecionamentos.
Crie um arquivo `.htaccess` na pasta `public_html`:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### 6. Passos detalhados:

1. **Baixe os arquivos da pasta `dist/`** (que foi criada pelo build)
2. **Acesse o File Manager da Hostinger**
3. **Navegue até a pasta `public_html`**
4. **Faça backup dos arquivos existentes** (se necessário)
5. **Faça upload dos arquivos da pasta `dist/`**
6. **Configure as variáveis de ambiente** (se usando Supabase)
7. **Teste o site** acessando seu domínio

### 7. Considerações importantes:

- **Banco de dados**: Este projeto usa Supabase. Você precisa ter uma conta e projeto configurado no Supabase
- **Domínio**: O projeto funcionará no seu domínio principal da Hostinger
- **HTTPS**: Certifique-se de que seu domínio tem SSL ativo para funcionar corretamente
- **Compatibilidade**: Este é um projeto moderno que requer navegadores atualizados

### 8. Troubleshooting:

Se encontrar problemas:
- Verifique se todos os arquivos foram enviados corretamente
- Confirme se as variáveis de ambiente estão configuradas
- Verifique o console do navegador para erros JavaScript
- Teste se o SSL está funcionando corretamente

### 9. Manutenção:

Para futuras atualizações:
1. Faça as alterações no código
2. Execute `npm run build` novamente
3. Faça upload dos novos arquivos da pasta `dist/`
