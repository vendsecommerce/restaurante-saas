#!/bin/bash

# Script de build para o Netlify
echo "🚀 Iniciando build para o Netlify..."

# Navegar para o frontend
cd frontend-restaurante

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer build
echo "🔨 Fazendo build..."
npm run build

# Voltar para a raiz
cd ..

# Verificar se a pasta public foi criada na raiz
if [ -d "public" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Pasta public criada em: $(pwd)/public"
    echo "📄 Arquivos gerados:"
    ls -la public/
else
    echo "❌ Erro: Pasta public não foi criada na raiz!"
    exit 1
fi

echo "🎉 Build finalizado!"
