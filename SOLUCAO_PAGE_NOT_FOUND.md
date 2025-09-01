# 🚨 SOLUÇÃO: Page Not Found

## 🔍 **Problema Identificado:**
O erro "Page not found" acontece porque o Next.js não está gerando corretamente os arquivos estáticos.

## ✅ **Soluções Aplicadas:**

### 1. **Configuração Específica do Netlify**
- Criado `next.config.netlify.js` com configurações otimizadas
- Comando de build alterado para `npm run build:netlify`

### 2. **Configurações Corrigidas**
- `distDir: 'public'` - Pasta de saída correta
- `assetPrefix: '.'` - Prefixo de assets correto
- `exportPathMap` - Mapeamento de rotas explícito
- `swcMinify: false` - Desabilita minificação problemática

### 3. **Arquivo _redirects**
- Criado `frontend-restaurante/public/_redirects`
- Configuração para SPA (Single Page Application)

## 🚀 **Como Aplicar as Correções:**

### 1. **Faça Push das Correções:**
```bash
git add .
git commit -m "Correções para resolver Page not found"
git push origin main
```

### 2. **Verifique o Build no Netlify:**
- Vá em **Deploys** no Netlify
- Clique no último deploy
- Verifique se o build foi bem-sucedido

### 3. **Teste as URLs:**
- Frontend: `https://seu-site.netlify.app`
- API: `https://seu-site.netlify.app/.netlify/functions/test`

## 🔧 **Se Ainda Não Funcionar:**

### A. **Verifique os Logs de Build:**
- No Netlify, vá em **Deploys**
- Clique no último deploy
- Veja os **Build logs**
- Procure por erros específicos

### B. **Teste Localmente:**
```bash
cd frontend-restaurante
npm install
npm run build:netlify
```

### C. **Verifique a Pasta Public:**
- Deve existir: `frontend-restaurante/public/`
- Deve conter: `index.html`, `_next/`, etc.

## 📋 **Checklist de Verificação:**
- [ ] Schema executado no Supabase
- [ ] Variáveis configuradas no Netlify
- [ ] Build bem-sucedido
- [ ] Pasta `public` criada
- [ ] Arquivo `_redirects` presente

## 🎯 **Configurações Importantes:**
- **Build Command**: `npm run build:netlify`
- **Publish Directory**: `frontend-restaurante/public`
- **Node Version**: 22.x
- **Plugin**: `@netlify/plugin-nextjs`
