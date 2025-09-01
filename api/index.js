const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://seu-frontend.vercel.app',
  credentials: true
}));

app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas das Mesas
app.post('/api/mesas', async (req, res) => {
  try {
    const { numero } = req.body;
    const qrCode = `mesa-${numero}-${Date.now()}`;
    
    const result = await pool.query(
      'INSERT INTO mesas (numero, qr_code) VALUES ($1, $2) RETURNING *',
      [numero, qrCode]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar mesa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/mesas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mesas ORDER BY numero');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar mesas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas do Cardápio
app.post('/api/cardapio', async (req, res) => {
  try {
    const { nome, preco, categoria, descricao } = req.body;
    const result = await pool.query(
      'INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, preco, categoria, descricao]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/cardapio', async (req, res) => {
  try {
    const { categoria, disponivel } = req.query;
    let query = 'SELECT * FROM cardapio';
    const params = [];
    
    if (categoria || disponivel) {
      query += ' WHERE';
      if (categoria) {
        query += ' categoria = $1';
        params.push(categoria);
      }
      if (disponivel !== undefined) {
        if (params.length > 0) query += ' AND';
        query += ` disponivel = $${params.length + 1}`;
        params.push(disponivel === 'true');
      }
    }
    
    query += ' ORDER BY categoria, nome';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar cardápio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas dos Pedidos
app.post('/api/pedidos', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { mesa_id, itens, observacoes } = req.body;
    
    // Criar pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (mesa_id, observacoes) VALUES ($1, $2) RETURNING *',
      [mesa_id, observacoes]
    );
    
    const pedido = pedidoResult.rows[0];
    
    // Adicionar itens
    for (const item of itens) {
      const itemResult = await client.query(
        'SELECT preco FROM cardapio WHERE id = $1',
        [item.item_id]
      );
      
      if (itemResult.rows.length === 0) {
        throw new Error(`Item ${item.item_id} não encontrado`);
      }
      
      await client.query(
        'INSERT INTO pedido_itens (pedido_id, item_id, quantidade, preco_unitario, observacoes) VALUES ($1, $2, $3, $4, $5)',
        [pedido.id, item.item_id, item.quantidade, itemResult.rows[0].preco, item.observacoes]
      );
    }
    
    await client.query('COMMIT');
    
    // Buscar pedido completo
    const pedidoCompleto = await client.query(
      `SELECT p.*, m.numero as mesa_numero,
        json_agg(
          json_build_object(
            'id', pi.id,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'observacoes', pi.observacoes,
            'item', json_build_object(
              'id', c.id,
              'nome', c.nome,
              'preco', c.preco,
              'categoria', c.categoria
            )
          )
        ) as itens
      FROM pedidos p
      JOIN mesas m ON p.mesa_id = m.id
      JOIN pedido_itens pi ON p.id = pi.pedido_id
      JOIN cardapio c ON pi.item_id = c.id
      WHERE p.id = $1
      GROUP BY p.id, m.numero`,
      [pedido.id]
    );
    
    res.json(pedidoCompleto.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const { status, mesa_id } = req.query;
    let query = `
      SELECT p.*, m.numero as mesa_numero,
        json_agg(
          json_build_object(
            'id', pi.id,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'observacoes', pi.observacoes,
            'item', json_build_object(
              'id', c.id,
              'nome', c.nome,
              'preco', c.preco,
              'categoria', c.categoria
            )
          )
        ) as itens
      FROM pedidos p
      JOIN mesas m ON p.mesa_id = m.id
      JOIN pedido_itens pi ON p.id = pi.pedido_id
      JOIN cardapio c ON pi.item_id = c.id
    `;
    
    const params = [];
    if (status || mesa_id) {
      query += ' WHERE';
      if (status) {
        query += ' p.status = $1';
        params.push(status);
      }
      if (mesa_id) {
        if (params.length > 0) query += ' AND';
        query += ` p.mesa_id = $${params.length + 1}`;
        params.push(mesa_id);
      }
    }
    
    query += ' GROUP BY p.id, m.numero ORDER BY p.criado_em DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'API do Restaurante funcionando!' });
});

// Exportar para Vercel
module.exports = app;
