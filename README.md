# DrVista Admin - Sistema de Gestão com Pedidos

Sistema administrativo moderno com autenticação segura, gestão de produtos e **sistema completo de pedidos** usando Next.js, TypeScript, Drizzle ORM e Better Auth.

## ✨ Funcionalidades

### 🔐 Autenticação
- Autenticação segura com Better Auth
- Login com Google OAuth
- Gerenciamento de sessões
- Proteção de rotas

### 📦 Gestão de Produtos
- Catálogo completo de produtos
- Categorias e subcategorias
- Controle de estoque
- Upload de imagens
- Filtros e busca

### 🛒 **Sistema de Pedidos (NOVO)**
- **Criação de pedidos** com múltiplos produtos
- **Gestão de clientes** com informações completas
- **Controle de status** (Pendente, Processamento, Concluído, Cancelado)
- **Atualização automática de estoque** ao criar/cancelar pedidos
- **Dashboard com estatísticas** de vendas e faturamento
- **Visualização detalhada** de pedidos
- **Geração automática** de números de pedido

### 📊 Dashboard e Relatórios
- Estatísticas de produtos e estoque
- **Estatísticas de pedidos e faturamento**
- **Controle de receita** por pedidos concluídos
- Cards informativos com métricas importantes

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM moderno para TypeScript
- **Better Auth** - Autenticação segura
- **Neon Database** - PostgreSQL serverless
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **Zod** - Validação de schemas

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais
- `user` - Usuários do sistema
- `category` / `subcategory` - Categorização de produtos
- `product` - Produtos com preços e estoque
- **`order`** - Pedidos com informações do cliente
- **`orderItem`** - Itens dos pedidos (produtos + quantidades)

### Relacionamentos
- Usuário pode ter múltiplos pedidos
- Pedido pode ter múltiplos itens
- Cada item está relacionado a um produto
- Controle de integridade referencial

## 📋 Funcionalidades do Sistema de Pedidos

### 1. Criação de Pedidos
- Interface intuitiva para seleção de produtos
- Validação de estoque em tempo real
- Cálculo automático de totais
- Campos para informações do cliente
- Observações opcionais

### 2. Gestão de Status
- **Pendente** - Pedido criado, aguardando processamento
- **Em Processamento** - Pedido sendo preparado
- **Concluído** - Pedido finalizado e entregue
- **Cancelado** - Pedido cancelado (estoque restaurado)

### 3. Controle de Estoque
- Redução automática do estoque ao criar pedido
- Restauração do estoque ao cancelar pedido
- Validação de disponibilidade antes da criação
- Alertas de estoque baixo

### 4. Dashboard de Vendas
- Total de pedidos registrados
- Quantidade por status
- Faturamento total (pedidos concluídos)
- Visualização em tempo real

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta no Neon Database
- Conta no Google Cloud (para OAuth)

### 1. Clone o repositório
```bash
git clone <repository-url>
cd drvista-admin
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` com:

```env
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Neon Database Configuration
DATABASE_URL=postgres://[user]:[password]@[host]/[database]

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Execute as migrações do banco
```bash
npx drizzle-kit push
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🔄 Migrações do Banco de Dados

O sistema inclui migrações para:
- Estrutura inicial de usuários e autenticação
- Tabelas de produtos e categorias
- **Tabelas de pedidos e itens** (migração 0007)

Para gerar novas migrações:
```bash
npx drizzle-kit generate
```

Para aplicar migrações:
```bash
npx drizzle-kit push
```

## 📖 Como Usar o Sistema de Pedidos

### 1. Acesse a página de Pedidos
- Navegue até `/pedidos` no menu principal
- Visualize o dashboard com estatísticas

### 2. Criar um novo pedido
- Clique em "Novo Pedido"
- Preencha as informações do cliente
- Adicione produtos ao pedido
- Confirme a criação

### 3. Gerenciar pedidos existentes
- Visualize todos os pedidos na tabela
- Altere o status conforme necessário
- Veja detalhes completos de cada pedido

### 4. Acompanhar métricas
- Monitore faturamento total
- Controle pedidos por status
- Analise tendências de vendas

## 🔐 Segurança

- Validação de dados com Zod
- Autenticação obrigatória para todas as operações
- Controle de acesso por usuário
- Sanitização de entradas
- Proteção contra SQL injection com Drizzle ORM

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado under the MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte, entre em contato através do email ou abra uma issue no GitHub.

---

**Sistema de Pedidos** desenvolvido com ❤️ usando tecnologias modernas para uma experiência completa de gestão empresarial.
