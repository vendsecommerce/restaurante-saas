import axios from 'axios';
import {
  Mesa,
  ItemCardapio,
  Pedido,
  CriarPedidoInput,
  ListaMesasResponse,
  ListaCardapioResponse,
  ListaPedidosResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs
api.interceptors.request.use((config) => {
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.url}:`, error.response?.data);
    return Promise.reject(error);
  }
);

// Serviços para Mesas
export const mesasService = {
  // Listar todas as mesas
  listar: async (): Promise<ListaMesasResponse> => {
    const response = await api.get('/mesas');
    return response.data;
  },

  // Buscar mesa por ID
  buscarPorId: async (id: number): Promise<Mesa> => {
    const response = await api.get(`/mesas/${id}`);
    return response.data.mesa;
  },

  // Criar nova mesa
  criar: async (numero: number): Promise<Mesa> => {
    const response = await api.post('/mesas', { numero });
    return response.data.mesa;
  },
};

// Serviços para Cardápio
export const cardapioService = {
  // Listar todos os itens
  listar: async (categoria?: string, disponivel?: boolean): Promise<ListaCardapioResponse> => {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (disponivel !== undefined) params.append('disponivel', disponivel.toString());
    
    const response = await api.get(`/cardapio?${params.toString()}`);
    return response.data;
  },

  // Buscar item por ID
  buscarPorId: async (id: number): Promise<ItemCardapio> => {
    const response = await api.get(`/cardapio/${id}`);
    return response.data.item;
  },

  // Criar novo item
  criar: async (item: Omit<ItemCardapio, 'id' | 'criado_em'>): Promise<ItemCardapio> => {
    const response = await api.post('/cardapio', item);
    return response.data.item;
  },

  // Atualizar item
  atualizar: async (id: number, item: Partial<ItemCardapio>): Promise<ItemCardapio> => {
    const response = await api.put(`/cardapio/${id}`, item);
    return response.data.item;
  },

  // Listar categorias
  listarCategorias: async (): Promise<string[]> => {
    const response = await api.get('/cardapio/categorias');
    return response.data.categorias;
  },
};

// Serviços para Pedidos
export const pedidosService = {
  // Listar todos os pedidos
  listar: async (status?: string, mesa_id?: number): Promise<ListaPedidosResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (mesa_id) params.append('mesa_id', mesa_id.toString());
    
    const response = await api.get(`/pedidos?${params.toString()}`);
    return response.data;
  },

  // Buscar pedido por ID
  buscarPorId: async (id: number): Promise<Pedido> => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data.pedido;
  },

  // Criar novo pedido
  criar: async (pedido: CriarPedidoInput): Promise<Pedido> => {
    const response = await api.post('/pedidos', pedido);
    return response.data.pedido;
  },

  // Atualizar status do pedido
  atualizarStatus: async (id: number, status: Pedido['status']): Promise<Pedido> => {
    const response = await api.put(`/pedidos/${id}/status`, { status });
    return response.data.pedido;
  },
};

export default api;
