-- Script MySQL para criar o banco de dados e tabelas do Restaurante SaaS

-- Criar banco de dados (execute separadamente se necessário)
-- CREATE DATABASE restaurante;

-- Conectar ao banco restaurante antes de executar os comandos abaixo

-- Tabela de mesas
CREATE TABLE IF NOT EXISTS mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('livre', 'ocupada') DEFAULT 'livre',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela do cardápio
CREATE TABLE IF NOT EXISTS cardapio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT NOT NULL,
    status ENUM('pendente', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
    itens JSON,
    total DECIMAL(10,2) DEFAULT 0.00,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_pedidos_mesa_id ON pedidos(mesa_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_cardapio_categoria ON cardapio(categoria);

-- Inserir alguns dados de exemplo
INSERT INTO mesas (numero, qr_code, status) VALUES 
(1, 'mesa-1-qr-123456', 'livre'),
(2, 'mesa-2-qr-234567', 'livre'),
(3, 'mesa-3-qr-345678', 'livre')
ON DUPLICATE KEY UPDATE numero = numero;

INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES 
('X-Burger', 25.90, 'Lanches', 'Hambúrguer com queijo, alface e tomate'),
('X-Salada', 28.90, 'Lanches', 'Hambúrguer com queijo, alface, tomate e cebola'),
('Batata Frita', 12.90, 'Acompanhamentos', 'Porção de batatas fritas crocantes'),
('Refrigerante', 8.90, 'Bebidas', 'Refrigerante 350ml'),
('Água', 5.90, 'Bebidas', 'Água mineral 500ml'),
('Sorvete', 15.90, 'Sobremesas', 'Sorvete de creme com calda')
ON DUPLICATE KEY UPDATE nome = nome;
