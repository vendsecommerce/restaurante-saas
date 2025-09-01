# ✅ Checklist de Deploy - Verificar Tudo

## 🔍 **PASSO A PASSO - Execute na ordem:**

### 1. ✅ Supabase Configurado?
- [ ] Acessou: https://supabase.com/dashboard/project/hylixobjiyckxzedwmvj
- [ ] Executou o SQL em **SQL Editor**
- [ ] Viu as tabelas em **Table Editor**: `mesas`, `cardapio`, `pedidos`

### 2. ✅ Variáveis no Netlify?
- [ ] SUPABASE_URL=https://hylixobjiyckxzedwmvj.supabase.co
- [ ] SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGl4b2JqaXlja3h6ZWR3bXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTIzNjUsImV4cCI6MjA3MjMyODM2NX0.aL5zgNORlafc3ZKKdE5O5F-iRkKUb58ZScEUTD_Mncs
- [ ] NODE_ENV=production
- [ ] NEXT_PUBLIC_API_URL=https://seu-site.netlify.app/.netlify/functions

### 3. ✅ Teste as URLs:
- [ ] Frontend: https://seu-site.netlify.app
- [ ] API Teste: https://seu-site.netlify.app/.netlify/functions/test
- [ ] API Health: https://seu-site.netlify.app/.netlify/functions/api/health

### 4. 🚨 **Se nada funcionar:**

#### A. Verifique os logs de build:
- No Netlify, vá em **Deploys**
- Clique no último deploy
- Veja os **Build logs**

#### B. Teste localmente:
```bash
cd frontend-restaurante
npm install
npm run build
```

#### C. Verifique se a pasta `public` foi criada:
- Deve existir: `frontend-restaurante/public/`

### 5. 🔧 **Soluções comuns:**

#### Problema: "Page not found"
- Verifique se o build foi bem-sucedido
- Confirme se a pasta `public` existe

#### Problema: "API não responde"
- Execute o schema no Supabase
- Verifique as variáveis de ambiente

#### Problema: "Build falha"
- Verifique se o Node.js 22 está sendo usado
- Confirme se todas as dependências estão instaladas

## 📞 **Se ainda não funcionar:**
1. Compartilhe os logs de build do Netlify
2. Confirme se executou o schema no Supabase
3. Verifique se as variáveis estão corretas

## 🆕 **Mudanças feitas:**
- ✅ Pasta de build alterada de `out` para `public`
- ✅ Configurações do Netlify atualizadas
- ✅ Gitignore atualizado
