const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hylixobjiyckxzedwmvj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGl4b2JqaXlja3h6ZWR3bXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTIzNjUsImV4cCI6MjA3MjMyODM2NX0.aL5zgNORlafc3ZKKdE5O5F-iRkKUb58ZScEUTD_Mncs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de teste
app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabase
      .from('mesas')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({ status: 'OK', message: 'API funcionando com Supabase!', data });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Rota para cardápio
app.get('/api/cardapio', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .eq('disponivel', true)
      .order('categoria', { ascending: true });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para mesas
app.get('/api/mesas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .order('numero', { ascending: true });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        mesas(numero, qr_code)
      `)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const { mesa_id, itens, total, observacoes } = req.body;
    
    // Criar pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        mesa_id,
        itens: itens || [],
        total: total || 0,
        observacoes,
        status: 'pendente'
      })
      .select()
      .single();
    
    if (pedidoError) throw pedidoError;
    
    // Atualizar status da mesa para ocupada
    await supabase
      .from('mesas')
      .update({ status: 'ocupada' })
      .eq('id', mesa_id);
    
    res.json({ id: pedido.id, message: 'Pedido criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar status do pedido
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { error } = await supabase
      .from('pedidos')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para liberar mesa
app.put('/api/mesas/:id/liberar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Atualizar status da mesa
    const { error: mesaError } = await supabase
      .from('mesas')
      .update({ status: 'livre' })
      .eq('id', id);
    
    if (mesaError) throw mesaError;
    
    // Marcar pedidos da mesa como entregues
    await supabase
      .from('pedidos')
      .update({ status: 'entregue' })
      .eq('mesa_id', id)
      .eq('status', 'pronto');
    
    res.json({ message: 'Mesa liberada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar item ao cardápio
app.post('/api/cardapio', async (req, res) => {
  try {
    const { nome, preco, categoria, descricao } = req.body;
    
    const { data, error } = await supabase
      .from('cardapio')
      .insert({
        nome,
        preco,
        categoria,
        descricao,
        disponivel: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar mesa
app.post('/api/mesas', async (req, res) => {
  try {
    const { numero } = req.body;
    const qr_code = `mesa-${numero}-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('mesas')
      .insert({
        numero,
        qr_code,
        status: 'livre'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware para capturar rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Exportar para Netlify Functions
exports.handler = async (event, context) => {
  // Converter evento do Netlify para request do Express
  const request = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : {},
    query: event.queryStringParameters || {}
  };

  // Simular response do Express
  let responseBody = '';
  let statusCode = 200;
  let headers = {};

  // Processar a requisição
  try {
    // Aqui você pode adicionar lógica específica para cada rota
    if (request.url === '/api/health') {
      responseBody = JSON.stringify({ status: 'OK', message: 'API funcionando com Supabase!' });
    } else if (request.url === '/api/cardapio') {
      // Implementar lógica para cardápio
      responseBody = JSON.stringify([]);
    } else {
      statusCode = 404;
      responseBody = JSON.stringify({ error: 'Rota não encontrada' });
    }
  } catch (error) {
    statusCode = 500;
    responseBody = JSON.stringify({ error: error.message });
  }

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: responseBody
  };
};
