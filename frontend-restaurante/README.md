# 🍽️ Frontend Restaurante SaaS

Frontend Next.js para o sistema de pedidos de restaurante com interface para clientes e administradores.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **Socket.io Client** - Comunicação em tempo real
- **Lucide React** - Ícones
- **clsx + tailwind-merge** - Utilitários para classes CSS

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Backend do restaurante rodando na porta 4000
- npm ou yarn

## 🛠️ Instalação

1. **Instale as dependências**
```bash
npm install
```

2. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📱 Funcionalidades

### 🎯 Interface do Cliente (`/mesa/[id]`)

- **Cardápio Digital**: Visualização organizada por categorias
- **Carrinho de Compras**: Adicionar, remover e ajustar quantidades
- **Observações**: Adicionar observações específicas para cada item
- **Pedido em Tempo Real**: Envio instantâneo para a cozinha
- **Confirmação**: Feedback visual de sucesso/erro

### 👨‍💼 Painel Administrativo (`/admin`)

#### 📋 Gestão de Pedidos
- **Visualização em Tempo Real**: Novos pedidos aparecem instantaneamente
- **Status Management**: Atualizar status (pendente → preparando → pronto → entregue)
- **Detalhes Completos**: Mesa, itens, observações, total e timestamp
- **Notificações**: Alertas visuais para novos pedidos

#### 🍽️ Gestão do Cardápio
- **CRUD Completo**: Criar, editar e visualizar itens
- **Categorização**: Organizar por categorias
- **Controle de Disponibilidade**: Ativar/desativar itens
- **Preços**: Gerenciar preços com precisão decimal

#### 🏠 Gestão de Mesas
- **Criação de Mesas**: Adicionar novas mesas automaticamente
- **QR Codes**: Geração automática de QR codes únicos
- **Visualização**: Lista organizada de todas as mesas

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── globals.css        # Estilos globais
│   ├── mesa/[id]/         # Página da mesa (cliente)
│   └── admin/             # Painel administrativo
├── components/            # Componentes reutilizáveis
├── services/             # Serviços de API e WebSocket
│   ├── api.ts            # Cliente HTTP e serviços
│   └── websocket.ts      # Cliente WebSocket
├── types/                # Definições TypeScript
│   └── index.ts          # Interfaces e tipos
└── utils/                # Utilitários
    └── cn.ts             # Função para classes CSS
```

## 🔌 Integração com Backend

### API REST
- **Base URL**: Configurável via `NEXT_PUBLIC_API_URL`
- **Endpoints**: Mesas, Cardápio e Pedidos
- **Interceptors**: Logs automáticos de requisições
- **Error Handling**: Tratamento robusto de erros

### WebSocket
- **Conexão Automática**: Conecta automaticamente ao painel admin
- **Eventos em Tempo Real**: Novos pedidos e atualizações de status
- **Reconexão**: Reconecta automaticamente em caso de falha
- **Sala de Admin**: Sistema de salas para notificações específicas

## 🎨 Design System

### Cores
- **Primary**: Orange (#ed7514) - Cor principal da marca
- **Success**: Green (#10b981) - Confirmações e sucessos
- **Warning**: Yellow (#f59e0b) - Avisos e pendências
- **Error**: Red (#ef4444) - Erros e cancelamentos
- **Info**: Blue (#3b82f6) - Informações e preparação

### Componentes
- **Cards**: Layout consistente para itens
- **Buttons**: Estados hover, disabled e loading
- **Modals**: Overlays para formulários
- **Notifications**: Toast notifications temporárias
- **Loading States**: Spinners e skeletons

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Tablet**: Layout adaptativo para tablets
- **Desktop**: Interface completa para desktop
- **Touch Friendly**: Botões e interações otimizadas para touch

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples e rápido
- **Docker**: Containerização disponível

## 🔒 Segurança

- **CORS**: Configurado para comunicação segura
- **Input Validation**: Validação de entrada em formulários
- **Error Boundaries**: Tratamento de erros em componentes
- **Type Safety**: TypeScript para prevenir erros

## 📊 Performance

- **Code Splitting**: Carregamento otimizado por rota
- **Image Optimization**: Otimização automática de imagens
- **Bundle Analysis**: Análise de tamanho de bundle
- **Caching**: Cache inteligente de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para restaurantes modernos**
