import { io, Socket } from 'socket.io-client';
import { Pedido } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Conectar ao servidor
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
        });

        this.socket.on('connect', () => {
          console.log('🔌 Conectado ao WebSocket');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('🔌 Desconectado do WebSocket');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Erro de conexão WebSocket:', error);
          this.isConnected = false;
          reject(error);
        });

      } catch (error) {
        console.error('❌ Erro ao inicializar WebSocket:', error);
        reject(error);
      }
    });
  }

  // Desconectar do servidor
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Desconectado do WebSocket');
    }
  }

  // Entrar na sala de administração
  joinAdmin(): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin');
      console.log('👨‍💼 Entrou na sala de administração');
    }
  }

  // Ouvir novos pedidos
  onNovoPedido(callback: (pedido: Pedido) => void): void {
    if (this.socket) {
      this.socket.on('novo-pedido', (pedido: Pedido) => {
        console.log('🆕 Novo pedido recebido:', pedido);
        callback(pedido);
      });
    }
  }

  // Ouvir atualizações de pedidos
  onPedidoAtualizado(callback: (data: { id: number; status: string }) => void): void {
    if (this.socket) {
      this.socket.on('pedido-atualizado', (data: { id: number; status: string }) => {
        console.log('🔄 Pedido atualizado:', data);
        callback(data);
      });
    }
  }

  // Remover listeners
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Verificar se está conectado
  get connected(): boolean {
    return this.isConnected;
  }

  // Obter socket
  get socketInstance(): Socket | null {
    return this.socket;
  }
}

// Instância singleton
const websocketService = new WebSocketService();

export default websocketService;
