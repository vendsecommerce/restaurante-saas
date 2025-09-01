-- Script para criar o banco de dados e tabelas do Restaurante SaaS

-- Criar banco de dados (execute separadamente se necessário)
-- CREATE DATABASE restaurante_saas;

-- Conectar ao banco restaurante_saas antes de executar os comandos abaixo

-- Tabela de mesas
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela do cardápio
CREATE TABLE IF NOT EXISTS cardapio (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente',
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES cardapio(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa_id ON pedidos(mesa_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON pedido_itens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_cardapio_categoria ON cardapio(categoria);

-- Trigger para atualizar o campo atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_atualizado_em
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em();

-- Inserir alguns dados de exemplo
INSERT INTO mesas (numero, qr_code) VALUES 
(1, 'mesa-1-qr-123456'),
(2, 'mesa-2-qr-234567'),
(3, 'mesa-3-qr-345678')
ON CONFLICT (numero) DO NOTHING;

INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES 
('X-Burger', 25.90, 'Lanches', 'Hambúrguer com queijo, alface e tomate'),
('X-Salada', 28.90, 'Lanches', 'Hambúrguer com queijo, alface, tomate e cebola'),
('Batata Frita', 12.90, 'Acompanhamentos', 'Porção de batatas fritas crocantes'),
('Refrigerante', 8.90, 'Bebidas', 'Refrigerante 350ml'),
('Água', 5.90, 'Bebidas', 'Água mineral 500ml'),
('Sorvete', 15.90, 'Sobremesas', 'Sorvete de creme com calda')
ON CONFLICT DO NOTHING;
