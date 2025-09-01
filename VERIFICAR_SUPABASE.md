# 🔍 Verificação do Supabase

## ⚠️ IMPORTANTE: Execute este schema primeiro!

### 1. Acesse o Supabase:
- URL: https://supabase.com/dashboard/project/hylixobjiyckxzedwmvj
- Vá em **SQL Editor** (ícone de código)

### 2. Execute este comando:
```sql
-- Criar tabelas
CREATE TABLE IF NOT EXISTS mesas (
    id BIGSERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    status TEXT DEFAULT 'livre' CHECK (status IN ('livre', 'ocupada')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cardapio (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Inserir dados de exemplo
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
```

### 3. Verifique se as tabelas foram criadas:
- Vá em **Table Editor**
- Deve aparecer: `mesas`, `cardapio`, `pedidos`

## 🚨 Se não aparecer, o deploy não funcionará!
