const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Importar rotas
const mesasRoutes = require('./routes/mesas');
const cardapioRoutes = require('./routes/cardapio');
const pedidosRoutes = require('./routes/pedidos');

// Usar rotas
app.use('/mesas', mesasRoutes);
app.use('/cardapio', cardapioRoutes);
app.use('/pedidos', pedidosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Restaurante SaaS funcionando!',
    version: '1.0.0',
    endpoints: {
      mesas: '/mesas',
      cardapio: '/cardapio',
      pedidos: '/pedidos'
    }
  });
});

// Socket.io para atualizações em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Admin conectado à sala de administração');
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Função para emitir novos pedidos para admins
const emitirNovoPedido = (pedido) => {
  io.to('admin-room').emit('novo-pedido', pedido);
};

// Exportar para uso nas rotas
app.set('io', io);
app.set('emitirNovoPedido', emitirNovoPedido);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Socket.io ativo para atualizações em tempo real`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
