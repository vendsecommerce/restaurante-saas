# 🍽️ Sistema de Restaurante - Self-Order SaaS

Sistema completo de pedidos para restaurantes com interface para clientes e painel administrativo.

## 🚀 Instalação e Deploy

### 🌐 Deploy no Vercel (Recomendado)

#### 1. Deploy Automático
```bash
# Execute o script de deploy
deploy-vercel.bat
```

#### 2. Deploy Manual
1. **Configure banco de dados**: [Supabase](https://supabase.com/) ou [Neon](https://neon.tech/)
2. **Deploy backend**: `cd api && vercel --prod`
3. **Deploy frontend**: `cd frontend-restaurante && vercel --prod`

### 💻 Instalação Local

#### Opção 1: Instalação Automática (Windows)
```bash
# Execute o instalador automático
instalar.bat

# Execute o sistema
executar.bat
```

#### Opção 2: Instalação Manual

##### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/download/) (v12+)

##### 2. Banco de Dados
```sql
CREATE DATABASE restaurante_saas;
\c restaurante_saas
-- Execute o conteúdo de database/schema.sql
```

##### 3. Backend
```bash
cd restaurante-saas
npm install
cp config.env .env
npm run dev
```

##### 4. Frontend
```bash
cd frontend-restaurante
npm install
cp env.example .env.local
npm run dev
```

## 🌐 Acessos

### 🚀 Produção (Vercel)
- **Frontend**: https://seu-projeto.vercel.app
- **Backend**: https://seu-api.vercel.app
- **Cliente**: https://seu-projeto.vercel.app/mesa/1
- **Admin**: https://seu-projeto.vercel.app/admin

### 💻 Local
- **Cliente**: http://localhost:3000/mesa/1
- **Admin**: http://localhost:3000/admin
- **API**: http://localhost:4000

## 📱 Funcionalidades

### Cliente
- ✅ Visualizar cardápio por categorias
- ✅ Adicionar itens ao carrinho
- ✅ Ajustar quantidades
- ✅ Adicionar observações
- ✅ Fazer pedido
- ✅ Confirmação em tempo real

### Admin
- ✅ Receber pedidos em tempo real
- ✅ Visualizar todos os pedidos do dia
- ✅ Atualizar status dos pedidos
- ✅ Gerenciar cardápio (CRUD)
- ✅ Gerenciar mesas (CRUD)

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- PostgreSQL
- Socket.io (tempo real)
- CORS

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Socket.io-client
- Axios

## 📁 Estrutura

```
restaurante-saas/
├── restaurante-saas/          # Backend
│   ├── server.js
│   ├── routes/
│   ├── config/
│   ├── database/
│   └── package.json
├── frontend-restaurante/       # Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── GUIA_INSTALACAO_LOCAL.md   # Guia detalhado
├── instalar.bat               # Instalador automático
├── executar.bat               # Executor automático
└── README.md                  # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente - Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurante_saas
DB_USER=postgres
DB_PASSWORD=123456
PORT=4000
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### Variáveis de Ambiente - Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## 🧪 Testes

### API Backend
```bash
cd restaurante-saas
node testes-api.js
```

### WebSocket
Abra `teste-websocket.html` no navegador

## 📊 Banco de Dados

### Tabelas
- `mesas` - Mesas do restaurante
- `cardapio` - Itens do menu
- `pedidos` - Pedidos dos clientes
- `pedido_itens` - Itens de cada pedido

### Dados de Exemplo
O sistema já vem com dados de exemplo:
- 3 mesas pré-configuradas
- Cardápio com bebidas, pratos principais e sobremesas

## 🎯 Próximos Passos

1. **Personalizar**: Adicione seus próprios itens ao cardápio
2. **Configurar**: Crie mesas com QR codes únicos
3. **Testar**: Faça pedidos e acompanhe como admin
4. **Deploy**: Configure para produção

## 📞 Suporte

Se encontrar problemas:
1. Verifique se Node.js e PostgreSQL estão instalados
2. Confirme se as portas 3000 e 4000 estão livres
3. Verifique os logs no terminal
4. Consulte o `GUIA_INSTALACAO_LOCAL.md` para instruções detalhadas

---

**🎉 Sistema pronto para uso!**
