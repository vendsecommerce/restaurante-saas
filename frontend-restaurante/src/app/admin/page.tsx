'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Utensils, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  QrCode,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { mesasService, cardapioService, pedidosService } from '@/services/api';
import websocketService from '@/services/websocket';
import { Mesa, ItemCardapio, Pedido } from '@/types';
import { cn } from '@/utils/cn';

type TabType = 'pedidos' | 'cardapio' | 'mesas';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pedidos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cardapio, setCardapio] = useState<ItemCardapio[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrders, setNewOrders] = useState<Pedido[]>([]);
  const [showNewOrderNotification, setShowNewOrderNotification] = useState(false);

  // Estados para modais
  const [showCardapioModal, setShowCardapioModal] = useState(false);
  const [showMesaModal, setShowMesaModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemCardapio | null>(null);
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pedidosRes, cardapioRes, mesasRes] = await Promise.all([
          pedidosService.listar(),
          cardapioService.listar(),
          mesasService.listar(),
        ]);
        
        setPedidos(pedidosRes.pedidos);
        setCardapio(cardapioRes.itens);
        setMesas(mesasRes.mesas);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Configurar WebSocket
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        await websocketService.connect();
        websocketService.joinAdmin();
        
        // Ouvir novos pedidos
        websocketService.onNovoPedido((pedido) => {
          setPedidos(prev => [pedido, ...prev]);
          setNewOrders(prev => [pedido, ...prev]);
          setShowNewOrderNotification(true);
          
          // Esconder notificação após 5 segundos
          setTimeout(() => setShowNewOrderNotification(false), 5000);
        });

        // Ouvir atualizações de pedidos
        websocketService.onPedidoAtualizado((data) => {
          setPedidos(prev => prev.map(pedido =>
            pedido.id === data.id ? { ...pedido, status: data.status as Pedido['status'] } : pedido
          ));
        });
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error);
      }
    };

    setupWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Atualizar status do pedido
  const updateOrderStatus = async (pedidoId: number, status: Pedido['status']) => {
    try {
      await pedidosService.atualizarStatus(pedidoId, status);
      setPedidos(prev => prev.map(pedido =>
        pedido.id === pedidoId ? { ...pedido, status } : pedido
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Criar/editar item do cardápio
  const saveCardapioItem = async (item: Partial<ItemCardapio>) => {
    try {
      if (editingItem) {
        await cardapioService.atualizar(editingItem.id, item);
      } else {
        await cardapioService.criar(item as Omit<ItemCardapio, 'id' | 'criado_em'>);
      }
      
      // Recarregar cardápio
      const response = await cardapioService.listar();
      setCardapio(response.itens);
      
      setShowCardapioModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  // Criar mesa
  const createMesa = async (numero: number) => {
    try {
      await mesasService.criar(numero);
      const response = await mesasService.listar();
      setMesas(response.mesas);
      setShowMesaModal(false);
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
    }
  };

  // Obter cor do status
  const getStatusColor = (status: Pedido['status']) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'preparando': return 'bg-blue-100 text-blue-800';
      case 'pronto': return 'bg-green-100 text-green-800';
      case 'entregue': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {newOrders.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {newOrders.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* New Order Notification */}
      {showNewOrderNotification && newOrders.length > 0 && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="h-5 w-5" />
          <span>Novo pedido recebido!</span>
          <button
            onClick={() => setShowNewOrderNotification(false)}
            className="ml-2 hover:bg-green-600 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
              { id: 'cardapio', label: 'Cardápio', icon: Utensils },
              { id: 'mesas', label: 'Mesas', icon: QrCode },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Pedidos Tab */}
          {activeTab === 'pedidos' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pedidos</h2>
                <div className="text-sm text-gray-500">
                  {pedidos.length} pedidos hoje
                </div>
              </div>

              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Mesa {pedido.mesa_numero} - Pedido #{pedido.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(pedido.status))}>
                        {pedido.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">Itens:</h4>
                      <div className="space-y-1">
                        {pedido.itens.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantidade}x {item.nome}</span>
                            <span>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pedido.observacoes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {pedido.observacoes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-gray-900">
                        Total: R$ {pedido.itens.reduce((sum, item) => sum + (item.preco_unitario * item.quantidade), 0).toFixed(2)}
                      </div>
                      <div className="flex space-x-2">
                        {pedido.status === 'pendente' && (
                          <button
                            onClick={() => updateOrderStatus(pedido.id, 'preparando')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Preparar
                          </button>
                        )}
                        {pedido.status === 'preparando' && (
                          <button
                            onClick={() => updateOrderStatus(pedido.id, 'pronto')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Pronto
                          </button>
                        )}
                        {pedido.status === 'pronto' && (
                          <button
                            onClick={() => updateOrderStatus(pedido.id, 'entregue')}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            Entregue
                          </button>
                        )}
                        {pedido.status === 'pendente' && (
                          <button
                            onClick={() => updateOrderStatus(pedido.id, 'cancelado')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cardápio Tab */}
          {activeTab === 'cardapio' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Cardápio</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowCardapioModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardapio.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.nome}</h3>
                        <p className="text-sm text-gray-500">{item.categoria}</p>
                      </div>
                      <span className="text-lg font-bold text-orange-600">
                        R$ {item.preco.toFixed(2)}
                      </span>
                    </div>
                    {item.descricao && (
                      <p className="text-sm text-gray-600 mb-3">{item.descricao}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', item.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {item.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowCardapioModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mesas Tab */}
          {activeTab === 'mesas' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mesas</h2>
                <button
                  onClick={() => setShowMesaModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Mesa</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mesas.map((mesa) => (
                  <div key={mesa.id} className="border rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Mesa {mesa.numero}</h3>
                      <div className="bg-gray-100 p-4 rounded-lg mb-3">
                        <QrCode className="h-16 w-16 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500 mt-2">{mesa.qr_code}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Criada em {new Date(mesa.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cardápio Modal */}
      {showCardapioModal && (
        <CardapioModal
          item={editingItem}
          onSave={saveCardapioItem}
          onClose={() => {
            setShowCardapioModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Mesa Modal */}
      {showMesaModal && (
        <MesaModal
          onSave={createMesa}
          onClose={() => setShowMesaModal(false)}
        />
      )}
    </div>
  );
}

// Componente Modal para Cardápio
function CardapioModal({ 
  item, 
  onSave, 
  onClose 
}: { 
  item: ItemCardapio | null; 
  onSave: (item: Partial<ItemCardapio>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    preco: item?.preco || 0,
    categoria: item?.categoria || '',
    descricao: item?.descricao || '',
    disponivel: item?.disponivel ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {item ? 'Editar Item' : 'Novo Item'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="disponivel"
              checked={formData.disponivel}
              onChange={(e) => setFormData(prev => ({ ...prev, disponivel: e.target.checked }))}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-900">
              Disponível
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal para Mesa
function MesaModal({ 
  onSave, 
  onClose 
}: { 
  onSave: (numero: number) => void; 
  onClose: () => void; 
}) {
  const [numero, setNumero] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(parseInt(numero));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Nova Mesa</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número da Mesa
            </label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Criar Mesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
