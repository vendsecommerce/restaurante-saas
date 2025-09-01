# 🚀 Deploy Rápido - Restaurante SaaS

## ⚡ Passos para Deploy no Netlify

### 1. 📝 Execute o Schema no Supabase
- Acesse: https://supabase.com/dashboard/project/hylixobjiyckxzedwmvj
- Vá em **SQL Editor**
- Execute o arquivo: `database/schema-supabase.sql`

### 2. 🔄 Faça Push do Código
```bash
git add .
git commit -m "Configuração para Netlify + Supabase (pasta public)"
git push origin main
```

### 3. 🌐 Conecte no Netlify
- Acesse: https://netlify.com
- **New site from Git**
- Escolha seu repositório
- **Deploy site**

### 4. ⚙️ Configure as Variáveis
No Netlify, vá em **Site settings > Environment variables**:

```
SUPABASE_URL=https://hylixobjiyckxzedwmvj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGl4b2JqaXlja3h6ZWR3bXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTIzNjUsImV4cCI6MjA3MjMyODM2NX0.aL5zgNORlafc3ZKKdE5O5F-iRkKUb58ZScEUTD_Mncs
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://seu-site.netlify.app/.netlify/functions
```

### 5. ✅ Pronto!
- Frontend: https://seu-site.netlify.app
- API: https://seu-site.netlify.app/.netlify/functions/api/health

## 🔧 Configurações Automáticas
- ✅ Build: `cd frontend-restaurante && npm install && npm run build`
- ✅ Publish: `frontend-restaurante/public`
- ✅ Functions: pasta `api/`
- ✅ Node: versão 22.x

## 📱 Teste a API
```bash
curl https://seu-site.netlify.app/.netlify/functions/api/health
```

## 🆘 Se der problema:
1. Verifique os logs de build no Netlify
2. Confirme se o schema foi executado no Supabase
3. Verifique as variáveis de ambiente
4. Teste localmente: `npm run build`

## 🎯 Funcionalidades Incluídas
- 🍽️ Sistema de Cardápio
- 🪑 Gerenciamento de Mesas
- 📋 Sistema de Pedidos
- 🔄 API Serverless
- 🎨 Frontend Next.js + Tailwind
- 🗄️ Banco Supabase (PostgreSQL)

## 🆕 **Mudanças Recentes:**
- ✅ Pasta de build alterada para `public` (sem slug)
- ✅ Configurações do Netlify atualizadas
- ✅ Roteamento simplificado
