# 🚀 Deploy no Vercel - Sistema de Restaurante

## 📋 Pré-requisitos

1. **Conta no Vercel**: https://vercel.com/signup
2. **Conta no PostgreSQL**: 
   - [Supabase](https://supabase.com/) (gratuito)
   - [Neon](https://neon.tech/) (gratuito)
   - [Railway](https://railway.app/) (pago)
3. **GitHub/GitLab**: Para conectar o repositório

## 🗄️ Configurando o Banco de Dados

### Opção 1: Supabase (Recomendado)

1. **Criar conta**: https://supabase.com/
2. **Criar projeto**:
   - Nome: `restaurante-saas`
   - Senha: escolha uma senha forte
3. **Executar SQL**:
   - Vá em "SQL Editor"
   - Cole o conteúdo do arquivo `database/schema.sql`
   - Execute

### Opção 2: Neon

1. **Criar conta**: https://neon.tech/
2. **Criar projeto**:
   - Nome: `restaurante-saas`
3. **Executar SQL**:
   - Vá em "SQL Editor"
   - Cole o conteúdo do arquivo `database/schema.sql`
   - Execute

## 🔧 Configurando o Backend

### 1. Preparar o Projeto

```bash
# Criar pasta para o backend
mkdir restaurante-api
cd restaurante-api

# Copiar arquivos
cp ../api/index.js .
cp ../api/package.json .
```

### 2. Configurar Variáveis de Ambiente

No Vercel, configure as seguintes variáveis:

```env
DATABASE_URL=postgresql://user:password@host:port/database
FRONTEND_URL=https://seu-frontend.vercel.app
NODE_ENV=production
```

### 3. Deploy do Backend

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

## 🌐 Configurando o Frontend

### 1. Atualizar URLs

No arquivo `frontend-restaurante/src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend.vercel.app';
```

No arquivo `frontend-restaurante/src/services/websocket.ts`:

```typescript
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://seu-backend.vercel.app';
```

### 2. Configurar Variáveis de Ambiente

No Vercel, configure:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://seu-backend.vercel.app
```

### 3. Deploy do Frontend

```bash
cd frontend-restaurante

# Deploy
vercel --prod
```

## 🚀 Deploy Automático via GitHub

### 1. Criar Repositório

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub
# Conectar com Vercel
```

### 2. Configurar Vercel

1. **Conectar GitHub**: No Vercel, conecte sua conta GitHub
2. **Importar Projeto**: Selecione o repositório
3. **Configurar Build**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend-restaurante`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Configurar Variáveis

No painel do Vercel:
- **Settings** > **Environment Variables**
- Adicione as variáveis de ambiente

## 📱 URLs Finais

Após o deploy, você terá:

- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://seu-api.vercel.app`
- **Cliente**: `https://seu-projeto.vercel.app/mesa/1`
- **Admin**: `https://seu-projeto.vercel.app/admin`

## 🔧 Configurações Avançadas

### 1. Domínio Personalizado

1. **Comprar domínio**: GoDaddy, Namecheap, etc.
2. **Configurar DNS**: Apontar para Vercel
3. **Adicionar no Vercel**: Settings > Domains

### 2. SSL/HTTPS

O Vercel fornece SSL automaticamente para todos os domínios.

### 3. Cache e Performance

```json
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

## 🧪 Testando o Deploy

### 1. Teste da API

```bash
curl https://seu-api.vercel.app/api
# Deve retornar: {"message": "API do Restaurante funcionando!"}
```

### 2. Teste do Frontend

1. Acesse: `https://seu-projeto.vercel.app`
2. Teste a página do cliente
3. Teste o painel admin

### 3. Teste do Banco

1. Crie uma mesa via API
2. Adicione itens ao cardápio
3. Faça um pedido
4. Verifique no painel admin

## 🔍 Monitoramento

### 1. Logs do Vercel

- **Function Logs**: Ver logs das APIs
- **Build Logs**: Ver logs do build
- **Analytics**: Métricas de performance

### 2. Banco de Dados

- **Supabase**: Dashboard com métricas
- **Neon**: Monitoramento de conexões

## 🚨 Solução de Problemas

### Erro de Conexão com Banco

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

### Erro de Build

```bash
# Verificar logs
vercel logs

# Build local
npm run build
```

### Erro de CORS

```javascript
// Verificar configuração
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 📊 Custos

### Vercel (Gratuito)
- **Frontend**: 100GB bandwidth/mês
- **Backend**: 100GB bandwidth/mês
- **Domínios**: Ilimitados

### Banco de Dados
- **Supabase**: 500MB, 2GB bandwidth
- **Neon**: 3GB, 10GB bandwidth

## 🎯 Próximos Passos

1. **Configurar domínio personalizado**
2. **Implementar autenticação**
3. **Adicionar analytics**
4. **Configurar backup automático**
5. **Implementar CI/CD**

---

**🎉 Seu sistema está online e funcionando!**
