# 🚀 Guia de Deploy Completo no Netlify com Supabase

## 📋 Pré-requisitos
- Conta no [Netlify](https://netlify.com)
- Projeto configurado com Git
- Banco de dados Supabase configurado

## 🔧 Configuração Automática

### 1. Conecte seu repositório
- Faça login no Netlify
- Clique em "New site from Git"
- Escolha seu provedor (GitHub, GitLab, Bitbucket)
- Selecione o repositório `restaurante-saas`

### 2. Configurações de Build
O Netlify já está configurado automaticamente com:
- **Base directory**: `.` (raiz do projeto)
- **Build command**: `cd frontend-restaurante && npm install && npm run build`
- **Publish directory**: `frontend-restaurante/out`
- **Node version**: 22.x

### 3. Variáveis de Ambiente
**IMPORTANTE:** Configure estas variáveis no Netlify:
- Vá em Site settings > Environment variables
- Adicione:

```
SUPABASE_URL=https://hylixobjiyckxzedwmvj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGl4b2JqaXlja3h6ZWR3bXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTIzNjUsImV4cCI6MjA3MjMyODM2NX0.aL5zgNORlafc3ZKKdE5O5F-iRkKUb58ZScEUTD_Mncs
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://seu-site.netlify.app/.netlify/functions
```

## 🚀 Deploy

### Opção 1: Deploy Automático
- Faça push para a branch `main` ou `master`
- O Netlify fará deploy automático

### Opção 2: Deploy Manual
- Clique em "Deploy site" no painel do Netlify

## 📁 Estrutura dos Arquivos
```
restaurante-saas/
├── netlify.toml          # Configuração principal do Netlify
├── frontend-restaurante/
│   ├── netlify.toml      # Configuração específica do frontend
│   ├── next.config.js    # Configuração do Next.js
│   ├── package.json      # Dependências do frontend
│   └── src/              # Código fonte do frontend
├── api/
│   ├── netlify.toml      # Configuração das funções
│   ├── package.json      # Dependências da API
│   └── index.js          # Funções serverless com Supabase
└── database/
    └── schema-supabase.sql # Esquema PostgreSQL para Supabase
```

## 🔌 API Functions

### Endpoints Disponíveis:
- `GET /.netlify/functions/api/health` - Status da API
- `GET /.netlify/functions/api/cardapio` - Listar cardápio
- `POST /.netlify/functions/api/cardapio` - Adicionar item ao cardápio
- `GET /.netlify/functions/api/mesas` - Listar mesas
- `POST /.netlify/functions/api/mesas` - Criar mesa
- `GET /.netlify/functions/api/pedidos` - Listar pedidos
- `POST /.netlify/functions/api/pedidos` - Criar pedido
- `PUT /.netlify/functions/api/pedidos/:id` - Atualizar pedido
- `PUT /.netlify/functions/api/mesas/:id/liberar` - Liberar mesa

## 🗄️ Configuração do Supabase

### 1. Execute o Schema
- Acesse o SQL Editor no seu projeto Supabase
- Execute o script `database/schema-supabase.sql`
- Isso criará todas as tabelas necessárias

### 2. Verifique as Tabelas
- `mesas` - Gerenciamento de mesas do restaurante
- `cardapio` - Itens disponíveis para pedido
- `pedidos` - Pedidos dos clientes

### 3. Dados de Exemplo
O schema inclui dados de exemplo:
- 3 mesas (livres)
- 6 itens do cardápio (lanches, bebidas, sobremesas)

## 🔍 Solução de Problemas

### Erro de Build
- Verifique se o Node.js 22 está sendo usado
- Confirme se todas as dependências estão instaladas
- Verifique os logs de build no Netlify

### Página não carrega
- Verifique se o build foi bem-sucedido
- Confirme se a pasta `out` foi gerada
- Verifique se as variáveis de ambiente estão configuradas

### API não funciona
- Confirme se as variáveis do Supabase estão corretas
- Verifique se as tabelas foram criadas no Supabase
- Teste o endpoint `/api/health`

### Problemas de Roteamento
- O arquivo `_redirects` está configurado para SPA
- Todas as rotas redirecionam para `index.html`
- As APIs redirecionam para as funções do Netlify

## 📞 Suporte
Se encontrar problemas:
1. Verifique os logs de build no Netlify
2. Confirme se a versão do Node.js está correta
3. Teste o build localmente com `npm run build`
4. Verifique as variáveis de ambiente
5. Teste a conexão com o Supabase
6. Execute o schema no SQL Editor do Supabase

## ✨ Funcionalidades
- ✅ Deploy automático
- ✅ Frontend Next.js otimizado
- ✅ Backend serverless com Netlify Functions
- ✅ API completa para restaurante
- ✅ Banco de dados Supabase (PostgreSQL)
- ✅ Roteamento SPA configurado
- ✅ Suporte a TypeScript
- ✅ Tailwind CSS configurado
- ✅ Plugin Next.js do Netlify

## 🔐 Segurança do Supabase
- **Row Level Security (RLS)** pode ser habilitado se necessário
- **API Keys** são seguras e podem ser regeneradas
- **Autenticação** pode ser adicionada posteriormente
- **Backups automáticos** incluídos no plano gratuito
