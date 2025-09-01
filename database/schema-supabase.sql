-- Script PostgreSQL para criar as tabelas no Supabase

-- Tabela de mesas
CREATE TABLE IF NOT EXISTS mesas (
    id BIGSERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    status TEXT DEFAULT 'livre' CHECK (status IN ('livre', 'ocupada')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela do cardápio
CREATE TABLE IF NOT EXISTS cardapio (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGSERIAL PRIMARY KEY,
    mesa_id BIGINT NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'preparando', 'pronto', 'entregue', 'cancelado')),
    itens JSONB DEFAULT '[]'::jsonb,
    total DECIMAL(10,2) DEFAULT 0.00,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa_id ON pedidos(mesa_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_cardapio_categoria ON cardapio(categoria);
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);

-- Trigger para atualizar o campo atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_atualizado_em
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em();

-- Inserir alguns dados de exemplo
INSERT INTO mesas (numero, qr_code, status) VALUES 
(1, 'mesa-1-qr-123456', 'livre'),
(2, 'mesa-2-qr-234567', 'livre'),
(3, 'mesa-3-qr-345678', 'livre')
ON CONFLICT (numero) DO NOTHING;

INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES 
('X-Burger', 25.90, 'Lanches', 'Hambúrguer com queijo, alface e tomate'),
('X-Salada', 28.90, 'Lanches', 'Hambúrguer com queijo, alface, tomate e cebola'),
('Batata Frita', 12.90, 'Acompanhamentos', 'Porção de batatas fritas crocantes'),
('Refrigerante', 8.90, 'Bebidas', 'Refrigerante 350ml'),
('Água', 5.90, 'Bebidas', 'Água mineral 500ml'),
('Sorvete', 15.90, 'Sobremesas', 'Sorvete de creme com calda')
ON CONFLICT DO NOTHING;

-- Configurar Row Level Security (RLS) se necessário
-- ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cardapio ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
