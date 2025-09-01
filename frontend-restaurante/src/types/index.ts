// Tipos para Mesa
export interface Mesa {
  id: number;
  numero: number;
  qr_code: string;
  criado_em: string;
}

// Tipos para Cardápio
export interface ItemCardapio {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao?: string;
  disponivel: boolean;
  criado_em: string;
}

// Tipos para Pedidos
export interface ItemPedido {
  id: number;
  item_id: number;
  quantidade: number;
  preco_unitario: number;
  observacoes?: string;
  nome: string;
  categoria: string;
}

export interface Pedido {
  id: number;
  mesa_id: number;
  mesa_numero: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
  itens: ItemPedido[];
}

// Tipos para criação de pedidos
export interface ItemPedidoInput {
  item_id: number;
  quantidade: number;
  observacoes?: string;
}

export interface CriarPedidoInput {
  mesa_id: number;
  itens: ItemPedidoInput[];
  observacoes?: string;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface ListaMesasResponse {
  message: string;
  mesas: Mesa[];
  total: number;
}

export interface ListaCardapioResponse {
  message: string;
  itens: ItemCardapio[];
  total: number;
  filtros: {
    categoria?: string;
    disponivel?: boolean;
  };
}

export interface ListaPedidosResponse {
  message: string;
  pedidos: Pedido[];
  total: number;
  filtros: {
    status?: string;
    mesa_id?: number;
  };
}

// Tipos para WebSocket
export interface WebSocketEvent {
  type: 'novo-pedido' | 'pedido-atualizado';
  data: any;
}
