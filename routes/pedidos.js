const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// POST /pedidos - Criar um novo pedido
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { mesa_id, itens, observacoes } = req.body;
    
    if (!mesa_id || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ 
        error: 'Mesa ID e lista de itens são obrigatórios' 
      });
    }

    // Iniciar transação
    await client.query('BEGIN');

    // Verificar se a mesa existe
    const mesa = await client.query(
      'SELECT * FROM mesas WHERE id = $1',
      [mesa_id]
    );

    if (mesa.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'Mesa não encontrada' 
      });
    }

    // Verificar se todos os itens existem e estão disponíveis
    const itemIds = itens.map(item => item.item_id);
    const itensCardapio = await client.query(
      'SELECT id, nome, preco, disponivel FROM cardapio WHERE id = ANY($1)',
      [itemIds]
    );

    if (itensCardapio.rows.length !== itemIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Um ou mais itens não foram encontrados' 
      });
    }

    // Verificar se todos os itens estão disponíveis
    const itensIndisponiveis = itensCardapio.rows.filter(item => !item.disponivel);
    if (itensIndisponiveis.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Os seguintes itens não estão disponíveis: ' + 
               itensIndisponiveis.map(item => item.nome).join(', ')
      });
    }

    // Criar o pedido
    const novoPedido = await client.query(
      'INSERT INTO pedidos (mesa_id, observacoes) VALUES ($1, $2) RETURNING *',
      [mesa_id, observacoes || null]
    );

    const pedidoId = novoPedido.rows[0].id;

    // Inserir itens do pedido
    const itensInseridos = [];
    for (const item of itens) {
      const itemCardapio = itensCardapio.rows.find(cardapioItem => cardapioItem.id === item.item_id);
      
      const itemPedido = await client.query(
        'INSERT INTO pedido_itens (pedido_id, item_id, quantidade, preco_unitario, observacoes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [pedidoId, item.item_id, item.quantidade || 1, itemCardapio.preco, item.observacoes || null]
      );
      
      itensInseridos.push({
        ...itemPedido.rows[0],
        nome: itemCardapio.nome
      });
    }

    // Commit da transação
    await client.query('COMMIT');

    // Buscar pedido completo com itens
    const pedidoCompleto = await pool.query(`
      SELECT 
        p.*,
        m.numero as mesa_numero,
        json_agg(
          json_build_object(
            'id', pi.id,
            'item_id', pi.item_id,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'observacoes', pi.observacoes,
            'nome', c.nome,
            'categoria', c.categoria
          )
        ) as itens
      FROM pedidos p
      JOIN mesas m ON p.mesa_id = m.id
      JOIN pedido_itens pi ON p.id = pi.pedido_id
      JOIN cardapio c ON pi.item_id = c.id
      WHERE p.id = $1
      GROUP BY p.id, m.numero
    `, [pedidoId]);

    const pedidoFinal = pedidoCompleto.rows[0];

    console.log(`✅ Novo pedido criado: Mesa ${mesa.rows[0].numero} - ${itensInseridos.length} itens`);

    // Emitir evento via Socket.io para admins
    const io = req.app.get('io');
    const emitirNovoPedido = req.app.get('emitirNovoPedido');
    if (emitirNovoPedido) {
      emitirNovoPedido(pedidoFinal);
    }

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      pedido: pedidoFinal
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar pedido:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  } finally {
    client.release();
  }
});

// GET /pedidos - Listar todos os pedidos com itens
router.get('/', async (req, res) => {
  try {
    const { status, mesa_id } = req.query;
    
    let query = `
      SELECT 
        p.*,
        m.numero as mesa_numero,
        json_agg(
          json_build_object(
            'id', pi.id,
            'item_id', pi.item_id,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'observacoes', pi.observacoes,
            'nome', c.nome,
            'categoria', c.categoria
          )
        ) as itens
      FROM pedidos p
      JOIN mesas m ON p.mesa_id = m.id
      JOIN pedido_itens pi ON p.id = pi.pedido_id
      JOIN cardapio c ON pi.item_id = c.id
    `;
    
    let params = [];
    let conditions = [];

    // Filtros
    if (status) {
      conditions.push(`p.status = $${params.length + 1}`);
      params.push(status);
    }

    if (mesa_id) {
      conditions.push(`p.mesa_id = $${params.length + 1}`);
      params.push(mesa_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id, m.numero ORDER BY p.criado_em DESC';

    const pedidos = await pool.query(query, params);

    res.json({
      message: 'Pedidos listados com sucesso',
      pedidos: pedidos.rows,
      total: pedidos.rows.length,
      filtros: {
        status: status || null,
        mesa_id: mesa_id || null
      }
    });

  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /pedidos/:id - Buscar pedido específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pedido = await pool.query(`
      SELECT 
        p.*,
        m.numero as mesa_numero,
        json_agg(
          json_build_object(
            'id', pi.id,
            'item_id', pi.item_id,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'observacoes', pi.observacoes,
            'nome', c.nome,
            'categoria', c.categoria
          )
        ) as itens
      FROM pedidos p
      JOIN mesas m ON p.mesa_id = m.id
      JOIN pedido_itens pi ON p.id = pi.pedido_id
      JOIN cardapio c ON pi.item_id = c.id
      WHERE p.id = $1
      GROUP BY p.id, m.numero
    `, [id]);

    if (pedido.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado' 
      });
    }

    res.json({
      message: 'Pedido encontrado',
      pedido: pedido.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// PUT /pedidos/:id/status - Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const statusValidos = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
    
    if (!status || !statusValidos.includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido. Status válidos: ' + statusValidos.join(', ')
      });
    }

    const pedidoAtualizado = await pool.query(
      'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (pedidoAtualizado.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado' 
      });
    }

    console.log(`✅ Status do pedido ${id} atualizado para: ${status}`);

    // Emitir atualização via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('pedido-atualizado', {
        id: parseInt(id),
        status: status
      });
    }

    res.json({
      message: 'Status do pedido atualizado com sucesso',
      pedido: pedidoAtualizado.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
