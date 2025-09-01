# 🚀 EXECUTAR BUILD - Resolver Page Not Found

## ⚡ **OPÇÃO 1: Deploy Automático no Netlify (RECOMENDADO)**

### 1. **Faça Push das Correções:**
```bash
git add .
git commit -m "Configuração para pasta public na raiz (sem slug)"
git push origin main
```

### 2. **O Netlify vai fazer build automático:**
- **Build Command**: `cd frontend-restaurante && npm install && npm run build`
- **Publish Directory**: `public` (na raiz do projeto)
- **Node Version**: 22.x

### 3. **Verifique o Build:**
- No Netlify, vá em **Deploys**
- Clique no último deploy
- Veja se foi bem-sucedido

## 🔧 **OPÇÃO 2: Build Local (se tiver Node.js instalado)**

### 1. **Execute o script PowerShell:**
```powershell
.\build-netlify.ps1
```

### 2. **Ou execute manualmente:**
```bash
cd frontend-restaurante
npm install
npm run build
cd ..
```

### 3. **Verifique se a pasta public foi criada na raiz:**
- Deve existir: `public/` (na raiz do projeto)
- Deve conter: `index.html`, `_next/`, etc.

## 📋 **O que foi corrigido:**

1. ✅ **Pasta public na raiz** - Sem slug, sem subpastas
2. ✅ **Configuração do Next.js** - `distDir: '../public'`
3. ✅ **Netlify configurado** - `publish = "public"`
4. ✅ **Arquivo _redirects** na pasta public da raiz
5. ✅ **Scripts de build** atualizados

## 🎯 **Resultado Esperado:**

Após o build, você deve ter:
- `public/index.html` - Página principal (na raiz)
- `public/_next/` - Assets do Next.js (na raiz)
- `public/_redirects` - Redirecionamentos (na raiz)

## 🚨 **Se ainda der erro:**

1. **Verifique os logs de build** no Netlify
2. **Confirme se executou o schema** no Supabase
3. **Verifique as variáveis** de ambiente
4. **Teste localmente** se possível

## ✨ **Agora a pasta public está na raiz, sem slug!**
