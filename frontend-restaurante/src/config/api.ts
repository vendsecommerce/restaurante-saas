// Configuração da API para o Netlify com Supabase
export const API_CONFIG = {
  // URL base da API no Netlify
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://seu-site.netlify.app/.netlify/functions',
  
  // Endpoints da API
  ENDPOINTS: {
    HEALTH: '/api/health',
    CARDAPIO: '/api/cardapio',
    MESAS: '/api/mesas',
    PEDIDOS: '/api/pedidos',
    LIBERAR_MESA: '/api/mesas',
  },
  
  // Configurações de timeout
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Função para construir URLs completas da API
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Função para fazer requisições à API
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const config: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, config);
};

// Funções específicas da API
export const api = {
  // Verificar status da API
  health: () => apiRequest(API_CONFIG.ENDPOINTS.HEALTH),
  
  // Cardápio
  getCardapio: () => apiRequest(API_CONFIG.ENDPOINTS.CARDAPIO),
  addItemCardapio: (data: any) => apiRequest(API_CONFIG.ENDPOINTS.CARDAPIO, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Mesas
  getMesas: () => apiRequest(API_CONFIG.ENDPOINTS.MESAS),
  createMesa: (data: any) => apiRequest(API_CONFIG.ENDPOINTS.MESAS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Pedidos
  getPedidos: () => apiRequest(API_CONFIG.ENDPOINTS.PEDIDOS),
  createPedido: (data: any) => apiRequest(API_CONFIG.ENDPOINTS.PEDIDOS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePedido: (id: number, data: any) => apiRequest(`${API_CONFIG.ENDPOINTS.PEDIDOS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Liberar mesa
  liberarMesa: (id: number) => apiRequest(`${API_CONFIG.ENDPOINTS.LIBERAR_MESA}/${id}/liberar`, {
    method: 'PUT',
  }),
};

// Tipos para TypeScript
export interface Mesa {
  id: number;
  numero: number;
  qr_code: string;
  status: 'livre' | 'ocupada';
  criado_em: string;
}

export interface ItemCardapio {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao?: string;
  disponivel: boolean;
  criado_em: string;
}

export interface Pedido {
  id: number;
  mesa_id: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  itens: any[];
  total: number;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
  mesas?: {
    numero: number;
    qr_code: string;
  };
}
