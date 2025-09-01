# 🍽️ Guia de Instalação Local - Sistema de Restaurante

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js** (versão 16 ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique com: `node --version`

2. **PostgreSQL** (versão 12 ou superior)
   - Baixe em: https://www.postgresql.org/download/
   - Ou use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres`

3. **Git** (opcional, para clonar repositórios)
   - Baixe em: https://git-scm.com/

## 🚀 Passo a Passo da Instalação

### 1. Configurar o Banco de Dados PostgreSQL

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE restaurante_saas;

# Conecte ao banco criado
\c restaurante_saas

# Execute o script SQL (copie e cole o conteúdo do arquivo database/schema.sql)
```

### 2. Configurar o Backend

```bash
# Navegue para a pasta do backend
cd restaurante-saas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Renomeie config.env para .env e ajuste as configurações:
cp config.env .env
```

**Conteúdo do arquivo `.env`:**
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurante_saas
DB_USER=postgres
DB_PASSWORD=123456

# Configurações do Servidor
PORT=4000
NODE_ENV=development
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### 3. Configurar o Frontend

```bash
# Navegue para a pasta do frontend
cd frontend-restaurante

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Renomeie env.example para .env.local:
cp env.example .env.local
```

**Conteúdo do arquivo `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## 🏃‍♂️ Como Executar

### 1. Iniciar o Backend

```bash
# Na pasta restaurante-saas
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 4000
📡 Socket.io ativo para atualizações em tempo real
🌐 Acesse: http://localhost:4000
✅ Conectado ao PostgreSQL
```

### 2. Iniciar o Frontend

```bash
# Em outro terminal, na pasta frontend-restaurante
npm run dev
```

Você deve ver:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 🧪 Testando o Sistema

### 1. Teste da API Backend

```bash
# Na pasta restaurante-saas
node testes-api.js
```

### 2. Teste do WebSocket

Abra o arquivo `teste-websocket.html` no navegador para testar as conexões em tempo real.

### 3. Teste do Frontend

1. **Página do Cliente**: Acesse `http://localhost:3000/mesa/1`
   - Você verá o cardápio
   - Adicione itens ao carrinho
   - Faça um pedido

2. **Painel Admin**: Acesse `http://localhost:3000/admin`
   - Veja os pedidos em tempo real
   - Gerencie o cardápio
   - Gerencie as mesas

## 📱 Funcionalidades para Testar

### Como Cliente:
1. Acesse `http://localhost:3000/mesa/1`
2. Navegue pelas categorias do cardápio
3. Adicione itens ao carrinho
4. Ajuste quantidades
5. Adicione observações
6. Faça o pedido
7. Veja a confirmação

### Como Admin:
1. Acesse `http://localhost:3000/admin`
2. **Aba Pedidos**: Veja pedidos em tempo real
3. **Aba Cardápio**: Adicione/edite itens do menu
4. **Aba Mesas**: Crie novas mesas

## 🔧 Solução de Problemas

### Erro de Conexão com PostgreSQL:
```bash
# Verifique se o PostgreSQL está rodando
# Windows: Serviços > PostgreSQL
# Linux/Mac: sudo systemctl status postgresql
```

### Erro de Porta em Uso:
```bash
# Verifique se as portas estão livres
netstat -ano | findstr :4000
netstat -ano | findstr :3000
```

### Erro de Dependências:
```bash
# Limpe o cache e reinstale
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro de Variáveis de Ambiente:
- Verifique se os arquivos `.env` e `.env.local` existem
- Confirme se as URLs estão corretas
- Reinicie os servidores após alterações

## 📊 Estrutura de Arquivos

```
restaurante-saas/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── database/
│   └── package.json
└── frontend-restaurante/
    ├── src/
    ├── public/
    └── package.json
```

## 🎯 Próximos Passos

1. **Personalizar o Cardápio**: Adicione seus próprios itens
2. **Configurar Mesas**: Crie mesas com QR codes únicos
3. **Testar Pedidos**: Faça pedidos como cliente e acompanhe como admin
4. **Personalizar Design**: Modifique cores e layout no frontend

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no terminal
2. Confirme se todas as dependências estão instaladas
3. Verifique se o PostgreSQL está rodando
4. Confirme se as portas 3000 e 4000 estão livres

---

**🎉 Parabéns! Seu sistema de restaurante está funcionando localmente!**
