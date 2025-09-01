const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

const router = express.Router();

// POST /mesas - Criar uma nova mesa
router.post('/', async (req, res) => {
  try {
    const { numero } = req.body;
    
    if (!numero) {
      return res.status(400).json({ 
        error: 'Número da mesa é obrigatório' 
      });
    }

    // Verificar se a mesa já existe
    const mesaExistente = await pool.query(
      'SELECT * FROM mesas WHERE numero = $1',
      [numero]
    );

    if (mesaExistente.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Mesa com este número já existe' 
      });
    }

    // Gerar QR code único
    const qrCode = `mesa-${numero}-qr-${uuidv4().substring(0, 8)}`;

    // Inserir nova mesa
    const novaMesa = await pool.query(
      'INSERT INTO mesas (numero, qr_code) VALUES ($1, $2) RETURNING *',
      [numero, qrCode]
    );

    console.log(`✅ Nova mesa criada: ${numero} - QR: ${qrCode}`);

    res.status(201).json({
      message: 'Mesa criada com sucesso',
      mesa: novaMesa.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao criar mesa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /mesas - Listar todas as mesas
router.get('/', async (req, res) => {
  try {
    const mesas = await pool.query(
      'SELECT * FROM mesas ORDER BY numero'
    );

    res.json({
      message: 'Mesas listadas com sucesso',
      mesas: mesas.rows,
      total: mesas.rows.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar mesas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /mesas/:id - Buscar mesa por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mesa = await pool.query(
      'SELECT * FROM mesas WHERE id = $1',
      [id]
    );

    if (mesa.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Mesa não encontrada' 
      });
    }

    res.json({
      message: 'Mesa encontrada',
      mesa: mesa.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar mesa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;
