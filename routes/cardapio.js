const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// POST /cardapio - Adicionar item ao cardápio
router.post('/', async (req, res) => {
  try {
    const { nome, preco, categoria, descricao } = req.body;
    
    if (!nome || !preco || !categoria) {
      return res.status(400).json({ 
        error: 'Nome, preço e categoria são obrigatórios' 
      });
    }

    if (preco <= 0) {
      return res.status(400).json({ 
        error: 'Preço deve ser maior que zero' 
      });
    }

    // Inserir novo item no cardápio
    const novoItem = await pool.query(
      'INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, preco, categoria, descricao || null]
    );

    console.log(`✅ Novo item adicionado ao cardápio: ${nome}`);

    res.status(201).json({
      message: 'Item adicionado ao cardápio com sucesso',
      item: novoItem.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar item ao cardápio:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /cardapio - Listar todos os itens do cardápio
router.get('/', async (req, res) => {
  try {
    const { categoria, disponivel } = req.query;
    
    let query = 'SELECT * FROM cardapio';
    let params = [];
    let conditions = [];

    // Filtro por categoria
    if (categoria) {
      conditions.push(`categoria ILIKE $${params.length + 1}`);
      params.push(`%${categoria}%`);
    }

    // Filtro por disponibilidade
    if (disponivel !== undefined) {
      conditions.push(`disponivel = $${params.length + 1}`);
      params.push(disponivel === 'true');
    }

    // Adicionar condições à query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY categoria, nome';

    const itens = await pool.query(query, params);

    res.json({
      message: 'Cardápio listado com sucesso',
      itens: itens.rows,
      total: itens.rows.length,
      filtros: {
        categoria: categoria || null,
        disponivel: disponivel || null
      }
    });

  } catch (error) {
    console.error('❌ Erro ao listar cardápio:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /cardapio/categorias - Listar categorias disponíveis
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await pool.query(
      'SELECT DISTINCT categoria FROM cardapio WHERE disponivel = true ORDER BY categoria'
    );

    res.json({
      message: 'Categorias listadas com sucesso',
      categorias: categorias.rows.map(row => row.categoria)
    });

  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /cardapio/:id - Buscar item por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await pool.query(
      'SELECT * FROM cardapio WHERE id = $1',
      [id]
    );

    if (item.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Item não encontrado' 
      });
    }

    res.json({
      message: 'Item encontrado',
      item: item.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar item:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// PUT /cardapio/:id - Atualizar item do cardápio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, categoria, descricao, disponivel } = req.body;
    
    // Verificar se o item existe
    const itemExistente = await pool.query(
      'SELECT * FROM cardapio WHERE id = $1',
      [id]
    );

    if (itemExistente.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Item não encontrado' 
      });
    }

    // Atualizar item
    const itemAtualizado = await pool.query(
      `UPDATE cardapio 
       SET nome = COALESCE($1, nome),
           preco = COALESCE($2, preco),
           categoria = COALESCE($3, categoria),
           descricao = COALESCE($4, descricao),
           disponivel = COALESCE($5, disponivel)
       WHERE id = $6 
       RETURNING *`,
      [nome, preco, categoria, descricao, disponivel, id]
    );

    console.log(`✅ Item atualizado: ${itemAtualizado.rows[0].nome}`);

    res.json({
      message: 'Item atualizado com sucesso',
      item: itemAtualizado.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar item:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
