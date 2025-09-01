'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Plus, Minus, CheckCircle, AlertCircle } from 'lucide-react';
import { cardapioService, pedidosService } from '@/services/api';
import { ItemCardapio, ItemPedidoInput } from '@/types';
import { cn } from '@/utils/cn';

interface CartItem extends ItemCardapio {
  quantidade: number;
  observacoes?: string;
}

export default function MesaPage() {
  const params = useParams();
  const mesaId = Number(params.id);
  
  const [cardapio, setCardapio] = useState<ItemCardapio[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Carregar cardápio
  useEffect(() => {
    const loadCardapio = async () => {
      try {
        setLoading(true);
        const response = await cardapioService.listar(undefined, true); // Apenas itens disponíveis
        setCardapio(response.itens);
      } catch (err) {
        setError('Erro ao carregar cardápio');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCardapio();
  }, []);

  // Obter categorias únicas
  const categorias = ['all', ...Array.from(new Set(cardapio.map(item => item.categoria)))];

  // Filtrar itens por categoria
  const filteredItems = selectedCategory === 'all' 
    ? cardapio 
    : cardapio.filter(item => item.categoria === selectedCategory);

  // Adicionar item ao carrinho
  const addToCart = (item: ItemCardapio) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  // Remover item do carrinho
  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Atualizar quantidade
  const updateQuantity = (itemId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantidade } : item
    ));
  };

  // Atualizar observações
  const updateObservations = (itemId: number, observacoes: string) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, observacoes } : item
    ));
  };

  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  // Enviar pedido
  const submitOrder = async () => {
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      const itens: ItemPedidoInput[] = cart.map(item => ({
        item_id: item.id,
        quantidade: item.quantidade,
        observacoes: item.observacoes,
      }));

      await pedidosService.criar({
        mesa_id: mesaId,
        itens,
      });

      setShowSuccess(true);
      setCart([]);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao enviar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando cardápio...</p>
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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mesa {mesaId}</h1>
              <p className="text-sm text-gray-500">Faça seus pedidos</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantidade, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Pedido enviado com sucesso!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cardápio */}
          <div className="lg:col-span-2">
            {/* Filtros de categoria */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setSelectedCategory(categoria)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      selectedCategory === categoria
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {categoria === 'all' ? 'Todos' : categoria}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de itens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
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
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Seu Pedido
              </h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Seu carrinho está vazio
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="border-b pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.nome}</h4>
                            <p className="text-sm text-gray-500">
                              R$ {item.preco.toFixed(2)} x {item.quantidade}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900">
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center">{item.quantidade}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remover
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Observações (opcional)"
                          value={item.observacoes || ''}
                          onChange={(e) => updateObservations(item.id, e.target.value)}
                          className="mt-2 w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={submitOrder}
                      disabled={submitting || cart.length === 0}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Enviando...' : 'Enviar Pedido'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
