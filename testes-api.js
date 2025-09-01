// Arquivo de exemplo para testar a API do Restaurante SaaS
// Execute com: node testes-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

// Função para fazer requisições com tratamento de erro
async function fazerRequisicao(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro em ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
}

// Função principal para executar os testes
async function executarTestes() {
  console.log('🚀 Iniciando testes da API do Restaurante SaaS\n');

  // 1. Testar rota de teste
  console.log('1. Testando rota de teste...');
  await fazerRequisicao('GET', '/');

  // 2. Criar mesas
  console.log('\n2. Criando mesas...');
  const mesa1 = await fazerRequisicao('POST', '/mesas', { numero: 10 });
  const mesa2 = await fazerRequisicao('POST', '/mesas', { numero: 11 });
  const mesa3 = await fazerRequisicao('POST', '/mesas', { numero: 12 });

  // 3. Listar mesas
  console.log('\n3. Listando mesas...');
  await fazerRequisicao('GET', '/mesas');

  // 4. Adicionar itens ao cardápio
  console.log('\n4. Adicionando itens ao cardápio...');
  await fazerRequisicao('POST', '/cardapio', {
    nome: 'X-Bacon Especial',
    preco: 35.90,
    categoria: 'Lanches',
    descricao: 'Hambúrguer com bacon, queijo e molho especial'
  });

  await fazerRequisicao('POST', '/cardapio', {
    nome: 'Milk Shake',
    preco: 18.90,
    categoria: 'Bebidas',
    descricao: 'Milk shake de chocolate, morango ou baunilha'
  });

  await fazerRequisicao('POST', '/cardapio', {
    nome: 'Batata Rústica',
    preco: 15.90,
    categoria: 'Acompanhamentos',
    descricao: 'Batatas rústicas assadas com ervas'
  });

  // 5. Listar cardápio
  console.log('\n5. Listando cardápio...');
  await fazerRequisicao('GET', '/cardapio');

  // 6. Listar categorias
  console.log('\n6. Listando categorias...');
  await fazerRequisicao('GET', '/cardapio/categorias');

  // 7. Criar pedidos
  console.log('\n7. Criando pedidos...');
  const pedido1 = await fazerRequisicao('POST', '/pedidos', {
    mesa_id: 1,
    itens: [
      { item_id: 1, quantidade: 2 },
      { item_id: 3, quantidade: 1, observacoes: 'Sem sal' }
    ],
    observacoes: 'Pedido urgente'
  });

  const pedido2 = await fazerRequisicao('POST', '/pedidos', {
    mesa_id: 2,
    itens: [
      { item_id: 2, quantidade: 1 },
      { item_id: 4, quantidade: 2 }
    ]
  });

  // 8. Listar pedidos
  console.log('\n8. Listando pedidos...');
  await fazerRequisicao('GET', '/pedidos');

  // 9. Atualizar status de pedidos
  console.log('\n9. Atualizando status dos pedidos...');
  if (pedido1?.pedido?.id) {
    await fazerRequisicao('PUT', `/pedidos/${pedido1.pedido.id}/status`, {
      status: 'preparando'
    });
  }

  if (pedido2?.pedido?.id) {
    await fazerRequisicao('PUT', `/pedidos/${pedido2.pedido.id}/status`, {
      status: 'pronto'
    });
  }

  // 10. Listar pedidos com filtros
  console.log('\n10. Listando pedidos com filtros...');
  await fazerRequisicao('GET', '/pedidos?status=pendente');
  await fazerRequisicao('GET', '/pedidos?mesa_id=1');

  console.log('\n🎉 Testes concluídos!');
  console.log('\n📝 Para testar WebSocket, conecte-se a:');
  console.log('   ws://localhost:4000');
  console.log('\n📖 Consulte o README.md para mais informações');
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  executarTestes().catch(console.error);
}

module.exports = { fazerRequisicao, executarTestes };
