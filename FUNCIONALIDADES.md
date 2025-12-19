# Inventário de Funcionalidades - ACME E-commerce

> Documento detalhado de todas as funcionalidades implementadas e pendentes para lançamento em produção.
>
> **Data de Geração**: 15 de Novembro de 2025

---

## Sumário

1. [Autenticação e Registro](#autenticação-e-registro)
2. [Cliente Autenticado](#cliente-autenticado)
3. [Cliente Convidado](#cliente-convidado)
4. [Catálogo de Produtos](#catálogo-de-produtos)
5. [Detalhes do Produto](#detalhes-do-produto)
6. [Carrinho de Compras](#carrinho-de-compras)
7. [Checkout](#checkout)
8. [Pagamento](#pagamento)
9. [Pedidos](#pedidos)
10. [Cupons de Desconto](#cupons-de-desconto)
11. [Prescrição Médica](#prescrição-médica)
12. [Avaliações de Produtos](#avaliações-de-produtos)
13. [Lista de Desejos](#lista-de-desejos)
14. [Emails e Notificações](#emails-e-notificações)
15. [Painel Administrativo](#painel-administrativo)
16. [Moderação de Conteúdo](#moderação-de-conteúdo)
17. [Gestão de Estoque](#gestão-de-estoque)
18. [Segurança](#segurança)
19. [Legal e Compliance](#legal-e-compliance)
20. [Infraestrutura](#infraestrutura)

---

## Autenticação e Registro

### Funcionalidades de Registro
- [x] Criar conta com email e senha
- [x] Criar conta usando Google
- [x] Receber link de confirmação por email ao criar conta
- [ ] Verificar email clicando no link recebido

### Funcionalidades de Login
- [x] Fazer login com email e senha
- [x] Fazer login com Google
- [x] Fazer login através de link enviado por email (sem senha)
- [x] Ver mensagens de erro em português quando login falha
- [x] Ver indicador de carregamento durante login
- [x] Ser redirecionado para página inicial após login
- [ ] Ser bloqueado temporariamente após várias tentativas erradas

### Funcionalidades de Recuperação de Senha
- [x] Solicitar nova senha informando email
- [x] Receber link para redefinir senha por email
- [x] Criar nova senha através do link recebido

### Funcionalidades de Sessão
- [x] Manter login ativo por 7 dias
- [x] Fazer logout da conta
- [ ] Ver lista de dispositivos conectados
- [ ] Desconectar outros dispositivos
- [ ] Receber alerta ao fazer login de novo dispositivo
- [ ] Ver histórico de logins recentes

### Funcionalidades de Segurança Adicional
- [ ] Ativar autenticação em dois fatores (código no celular)
- [ ] Receber código por SMS ao fazer login
- [ ] Receber código por app autenticador

### Regras de Negócio da Autenticação
- [x] Sessão deve expirar após 7 dias sem uso
- [x] Senhas devem ser armazenadas de forma segura (criptografadas)
- [x] Links de redefinição de senha devem expirar
- [ ] Bloquear conta após 5 tentativas falhadas consecutivas
- [ ] Desbloqueio automático após 15 minutos
- [ ] Senha deve ter mínimo 8 caracteres com letras e números
- [ ] Link de verificação de email deve expirar em 24 horas

---

## Cliente Autenticado

### Funcionalidades do Perfil
- [x] Acessar página "Minha Conta"
- [x] Ver nome cadastrado
- [x] Ver email cadastrado
- [x] Ver telefone cadastrado
- [ ] Editar nome
- [ ] Editar telefone
- [ ] Editar email (com confirmação)
- [ ] Alterar senha (informando senha atual)
- [ ] Informar CPF
- [ ] Informar data de nascimento
- [ ] Adicionar foto de perfil
- [ ] Remover foto de perfil
- [ ] Excluir conta permanentemente
- [ ] Solicitar cópia de todos os dados pessoais (LGPD)

### Funcionalidades de Endereços
- [x] Ver lista de endereços salvos
- [x] Adicionar novo endereço
- [x] Informar rua, número, complemento, bairro, cidade, estado, CEP
- [x] Marcar endereço como "sem número"
- [x] Marcar endereço como "sem complemento"
- [x] Definir um endereço como padrão
- [x] Ter múltiplos endereços cadastrados
- [ ] Editar endereço existente
- [ ] Excluir endereço
- [ ] Dar apelido ao endereço (Ex: "Casa", "Trabalho")
- [ ] Preencher endereço automaticamente ao digitar CEP
- [ ] Ver validação de CEP em tempo real

### Funcionalidades de Preferências
- [ ] Escolher receber ou não emails promocionais
- [ ] Escolher receber ou não emails de novidades

### Regras de Negócio do Cliente
- [x] Cliente deve ter pelo menos nome cadastrado
- [x] Telefone é opcional
- [x] Pode ter vários endereços salvos
- [x] Apenas um endereço pode ser o padrão
- [x] Endereço precisa ter rua, bairro, cidade e estado
- [ ] CPF deve ser válido (verificação de dígitos)
- [ ] CPF deve ser único por cliente
- [ ] Foto de perfil máximo 5MB
- [ ] Para excluir conta, precisa confirmar com senha

---

## Cliente Convidado

### Funcionalidades de Navegação
- [x] Ver página inicial sem precisar criar conta
- [x] Ver lista de produtos sem criar conta
- [x] Ver detalhes do produto sem criar conta
- [x] Ver preços sem criar conta
- [x] Ver fotos dos produtos sem criar conta

### Funcionalidades de Compra
- [x] Adicionar produtos ao carrinho sem criar conta
- [x] Ver carrinho sem criar conta
- [x] Alterar quantidades no carrinho sem criar conta
- [x] Remover produtos do carrinho sem criar conta
- [x] Finalizar compra sem criar conta
- [x] Informar dados pessoais no checkout (nome, email, telefone)
- [x] Informar endereço de entrega no checkout
- [x] Receber confirmação por email após compra
- [ ] Criar conta ao final da compra com dados já preenchidos
- [ ] Acessar pedido através de link no email (sem precisar de conta)
- [ ] Consultar pedido informando email e número do pedido

### Funcionalidades de Persistência
- [x] Carrinho é salvo mesmo fechando o navegador
- [x] Carrinho é recuperado ao voltar ao site
- [ ] Carrinho do navegador é transferido para conta ao fazer login
- [ ] Itens duplicados são somados ao transferir carrinho

### Regras de Negócio do Cliente Convidado
- [x] Carrinho fica salvo no navegador
- [x] Ao comprar, cliente informar nome, email e telefone
- [x] Endereço é obrigatório para entrega
- [x] Pedido é criado mesmo sem conta
- [ ] Link de acesso ao pedido expira em 30 dias
- [ ] Convidado pode criar conta usando email do pedido

---

## Catálogo de Produtos

### Funcionalidades de Listagem
- [x] Ver lista de produtos na página inicial
- [x] Ver produtos em destaque (até 8)
- [x] Ver nome do produto
- [x] Ver foto principal do produto
- [x] Ver preço do produto
- [x] Ver apenas produtos disponíveis (ativos)
- [x] Clicar no produto para ver detalhes
- [ ] Ver indicador "Novo" em produtos recentes
- [ ] Ver indicador "Promoção" em produtos com desconto
- [ ] Ver indicador "Esgotado" quando sem estoque
- [ ] Ver preço original riscado quando em promoção
- [ ] Ver percentual de desconto
- [ ] Ver avaliação média (estrelas)
- [ ] Ver seção "Mais Vendidos"
- [ ] Ver seção "Novidades"
- [ ] Ver seção "Em Promoção"

### Funcionalidades de Busca
- [ ] Buscar produtos por nome
- [ ] Ver sugestões enquanto digita
- [ ] Ver quantidade de resultados encontrados
- [ ] Ver mensagem quando não encontrar nada
- [ ] Ver histórico de buscas recentes
- [ ] Limpar histórico de buscas

### Funcionalidades de Filtros
- [ ] Filtrar por categoria
- [ ] Filtrar por faixa de preço
- [ ] Filtrar por cor
- [ ] Filtrar por formato (aviador, redondo, gatinho)
- [ ] Filtrar por gênero (masculino, feminino, unissex)
- [ ] Filtrar por disponibilidade em estoque
- [ ] Filtrar produtos em promoção
- [ ] Combinar vários filtros ao mesmo tempo
- [ ] Ver quantos produtos tem em cada filtro
- [ ] Limpar todos os filtros
- [ ] Ver filtros ativos como botões removíveis

### Funcionalidades de Ordenação
- [ ] Ordenar por preço (menor para maior)
- [ ] Ordenar por preço (maior para menor)
- [ ] Ordenar por mais recentes
- [ ] Ordenar por mais vendidos
- [ ] Ordenar por melhor avaliação
- [ ] Ordenar por nome (A-Z)

### Funcionalidades de Categorias
- [x] Ter categorias cadastradas
- [ ] Ver menu de categorias
- [ ] Navegar por categoria específica
- [ ] Ver caminho de navegação (breadcrumb)
- [ ] Ver subcategorias
- [ ] Ver página dedicada da categoria
- [ ] Ver descrição da categoria

### Funcionalidades de Paginação
- [ ] Ver paginação quando muitos produtos
- [ ] Navegar entre páginas
- [ ] Ver página atual
- [ ] Ver total de páginas
- [ ] Escolher quantos produtos por página (12, 24, 48)
- [ ] Ver indicador de carregamento

### Regras de Negócio do Catálogo
- [x] Mostrar apenas produtos ativos
- [x] Produtos inativos não aparecem
- [x] Cada produto tem URL amigável (slug)
- [ ] Produto é "Novo" se cadastrado há menos de 30 dias
- [ ] Produto é "Promoção" se tem desconto maior que 0%
- [ ] Produto é "Esgotado" se estoque é 0
- [ ] Busca ignora maiúsculas/minúsculas
- [ ] Busca ignora acentos
- [ ] Máximo 20 produtos por página
- [ ] "Mais Vendidos" considera vendas dos últimos 30 dias

---

## Detalhes do Produto

### Funcionalidades de Informações
- [x] Ver nome completo do produto
- [x] Ver descrição curta
- [x] Ver descrição completa
- [x] Ver preço em Reais (R$)
- [x] Ver preço formatado (ex: R$ 299,90)
- [x] Acessar produto pela URL amigável
- [ ] Ver código/SKU do produto
- [ ] Ver preço original quando em promoção
- [ ] Ver percentual de desconto
- [ ] Ver parcelamento (ex: 12x de R$ 24,99)
- [ ] Ver se tem frete grátis
- [ ] Ver marca
- [ ] Ver garantia

### Funcionalidades de Imagens
- [x] Ver foto principal
- [x] Ver várias fotos do produto
- [x] Ver carrossel de fotos
- [x] Ter uma foto definida como principal
- [ ] Ampliar foto ao clicar (zoom)
- [ ] Arrastar para ver próxima foto (mobile)

### Funcionalidades de Opções de Lente
- [x] Ver opções de lente disponíveis
- [x] Ver painel para escolher lentes
- [x] Ver nome de cada tipo de lente
- [x] Ver preço adicional de cada lente
- [x] Selecionar várias opções de lente
- [x] Ver total atualizado ao escolher lentes
- [x] Adicionar óculos com lentes escolhidas ao carrinho
- [x] Ver descrição de cada tipo de lente
- [ ] Ver se lente precisa de receita médica
- [ ] Ver comparativo entre tipos de lente

### Funcionalidades de Variantes
- [x] Ter estrutura para cores diferentes
- [ ] Ver cores disponíveis
- [ ] Selecionar cor desejada
- [ ] Ver foto mudar ao selecionar cor
- [ ] Ver indicador da cor selecionada
- [ ] Ver nome da cor
- [ ] Ver se tem estoque da cor escolhida

### Funcionalidades de Especificações
- [x] Ver seção de detalhes expansível
- [ ] Ver largura da armação
- [ ] Ver altura da lente
- [ ] Ver comprimento da haste
- [ ] Ver material da armação
- [ ] Ver proteção UV
- [ ] Ver tratamentos da lente
- [ ] Ver cuidados com o produto

### Funcionalidades de Disponibilidade
- [x] Ter quantidade em estoque registrada
- [ ] Ver se produto está disponível
- [ ] Ver "Últimas Unidades" quando estoque baixo
- [ ] Ver "Esgotado" quando sem estoque
- [ ] Botão "Adicionar ao Carrinho" desativado quando esgotado
- [ ] Cadastrar email para aviso quando voltar ao estoque
- [ ] Receber email quando produto voltar ao estoque

### Funcionalidades de Compartilhamento
- [x] Adicionar ao carrinho
- [x] Ver botão "Adicionar ao Carrinho"
- [ ] Adicionar à lista de desejos
- [ ] Compartilhar no WhatsApp
- [ ] Compartilhar em redes sociais
- [ ] Copiar link do produto

### Regras de Negócio do Produto
- [x] Óculos é o produto principal (pai)
- [x] Opções de lente são filhas do óculos
- [x] Preço é armazenado em centavos para precisão
- [x] Preço com desconto = preço × (1 - desconto%)
- [x] Deve ser possível definir uma imagem como padrão
- [x] Pode ter várias imagens por produto
- [x] Produto inativo não aparece no catálogo
- [ ] Mostrar "Esgotado" quando estoque = 0
- [ ] Mostrar "Últimas Unidades" quando estoque < 5

---

## Carrinho de Compras

### Funcionalidades de Visualização
- [x] Ver página do carrinho
- [x] Ver lista de todos os itens
- [x] Ver nome de cada produto
- [x] Ver foto de cada produto
- [x] Ver preço unitário
- [x] Ver quantidade de cada item
- [x] Ver preço total por item (quantidade × preço)
- [x] Ver opções de lente junto com o óculos
- [x] Ver subtotal de todos os itens
- [x] Ver resumo ao lado (desktop)
- [ ] Ver quantidade total de itens no ícone do carrinho

### Funcionalidades de Gerenciamento
- [x] Aumentar quantidade de um item
- [x] Diminuir quantidade de um item
- [x] Remover item do carrinho
- [x] Ao mudar quantidade do óculos, muda das lentes também
- [x] Ao remover óculos, remove as lentes junto
- [ ] Alterar opções de lente sem remover produto
- [ ] Mover produto para lista de desejos
- [ ] Ver confirmação antes de remover
- [ ] Limpar carrinho completamente

### Funcionalidades de Persistência
- [x] Carrinho salvo no navegador
- [x] Carrinho recuperado ao voltar ao site
- [x] ID do carrinho é mantido
- [ ] Carrinho sincronizado entre dispositivos (se logado)
- [ ] Receber email de lembrete após 24h de abandono
- [ ] Receber email de lembrete após 48h de abandono
- [ ] Receber email com cupom após 72h de abandono
- [ ] Link direto para recuperar carrinho abandonado

### Funcionalidades de Navegação
- [x] Continuar comprando após adicionar item
- [x] Ir para checkout a partir do carrinho
- [ ] Ver ícone do carrinho no topo com quantidade
- [ ] Ver mini-carrinho ao passar mouse no ícone
- [ ] Acessar carrinho de qualquer página
- [ ] Ver carrinho como painel lateral

### Funcionalidades de Cálculos
- [x] Calcular preço unitário (óculos + lentes)
- [x] Calcular total por linha
- [x] Calcular subtotal geral
- [x] Preços armazenados em centavos
- [x] Preços formatados em Reais
- [ ] Calcular frete baseado no CEP
- [ ] Aplicar cupom de desconto
- [ ] Ver desconto aplicado
- [ ] Ver total final (subtotal + frete - desconto)

### Regras de Negócio do Carrinho
- [x] Óculos e lentes ficam agrupados
- [x] Mudar quantidade de um muda de todos do grupo
- [x] Remover óculos remove todas as lentes
- [x] Adicionar produto que já existe aumenta quantidade
- [x] Quantidade mínima é 1
- [x] ID do carrinho é gerado automaticamente
- [x] Preço unitário = óculos + todas as lentes
- [ ] Quantidade máxima é o estoque disponível
- [ ] Não permitir adicionar se sem estoque
- [ ] Avisar se item no carrinho ficou sem estoque
- [ ] Carrinho expira após 30 dias sem uso
- [ ] Avisar cliente 7 dias antes de expirar
- [ ] Cupom de recuperação expira em 7 dias

---

## Checkout

### Funcionalidades do Fluxo
- [x] Ver checkout em etapas (accordion)
- [x] Etapa 1: Dados do Cliente
- [x] Etapa 2: Endereço de Entrega
- [x] Etapa 3: Método de Envio
- [x] Etapa 4: Forma de Pagamento
- [x] Ver resumo do pedido ao lado
- [x] Avançar entre etapas
- [ ] Voltar para etapas anteriores
- [ ] Ver indicador de progresso
- [ ] Ver etapas concluídas marcadas
- [ ] Ver validação em tempo real
- [ ] Salvar progresso automaticamente
- [ ] Recuperar checkout incompleto ao voltar

### Funcionalidades de Dados do Cliente
- [x] Informar nome completo
- [x] Informar email
- [x] Informar telefone
- [x] Ver erro se email inválido
- [x] Ver erro se campo obrigatório vazio
- [x] Criar registro do cliente
- [x] Vincular cliente ao pedido
- [ ] Ver máscara no telefone (00) 00000-0000
- [ ] Informar CPF
- [ ] Ver máscara no CPF 000.000.000-00
- [ ] Ver erro se CPF inválido
- [ ] Campos preenchidos automaticamente se logado

### Funcionalidades de Endereço
- [x] Informar rua
- [x] Informar número
- [x] Marcar "sem número"
- [x] Informar complemento
- [x] Marcar "sem complemento"
- [x] Informar bairro
- [x] Informar cidade
- [x] Informar estado
- [x] Informar CEP
- [x] Ver erro se campo obrigatório vazio
- [x] Criar registro do endereço
- [x] Vincular endereço ao pedido
- [ ] Ver máscara no CEP 00000-000
- [ ] Preencher endereço automaticamente pelo CEP
- [ ] Selecionar endereço salvo (se logado)
- [ ] Salvar endereço para próximas compras
- [ ] Informar ponto de referência

### Funcionalidades de Envio
- [x] Ver lista de métodos de envio
- [x] Ver nome de cada método
- [x] Ver custo de cada método
- [x] Selecionar um método
- [ ] Ver prazo de entrega de cada método
- [ ] Calcular frete dinamicamente pelo CEP
- [ ] Ver opção de frete grátis quando aplicável
- [ ] Ver opção de retirada na loja
- [ ] Selecionar seguro opcional

### Funcionalidades de Pagamento
- [x] Ver formulário de cartão de crédito
- [x] Integração com Stripe
- [x] Informar número do cartão
- [x] Informar validade
- [x] Informar código de segurança (CVV)
- [x] Informar nome no cartão
- [x] Ver bandeiras aceitas
- [ ] Pagar com PIX
- [ ] Ver QR Code do PIX
- [ ] Ver código copia e cola do PIX
- [ ] Ver tempo restante do PIX
- [ ] Pagar com Boleto
- [ ] Ver/baixar boleto
- [ ] Ver vencimento do boleto
- [ ] Parcelar compra
- [ ] Ver opções de parcelamento
- [ ] Ver valor de cada parcela
- [ ] Ver juros quando aplicável
- [ ] Salvar cartão para próximas compras
- [ ] Selecionar cartão salvo

### Funcionalidades do Resumo
- [x] Ver todos os itens do pedido
- [x] Ver foto de cada produto
- [x] Ver nome de cada produto
- [x] Ver quantidade de cada produto
- [x] Ver preço de cada produto
- [x] Ver opções de lente listadas
- [x] Ver subtotal
- [x] Ver custo do frete
- [x] Ver desconto aplicado (cupom)
- [x] Ver total final
- [x] Ver preços formatados em Reais
- [ ] Editar quantidade no checkout
- [ ] Remover item no checkout
- [ ] Ver alerta de estoque baixo

### Funcionalidades de Validação
- [x] Validar campos obrigatórios preenchidos
- [x] Validar formato do email
- [x] Mostrar erros em português
- [ ] Validar CPF é válido
- [ ] Validar CEP existe
- [ ] Validar cartão antes de cobrar
- [ ] Validar endereço é entregável
- [ ] Validar estoque disponível antes de pagar
- [ ] Aceitar termos de uso obrigatoriamente

### Funcionalidades de Finalização
- [x] Converter carrinho em pedido
- [x] Criar registro do pedido
- [x] Criar registro do pagamento
- [x] Vincular cliente ao pedido
- [x] Vincular endereço ao pedido
- [x] Vincular método de envio ao pedido
- [x] Confirmar pagamento de forma segura
- [x] Redirecionar para página de sucesso
- [ ] Ver mensagem de processamento
- [ ] Ver animação de carregamento
- [ ] Ver erro se pagamento recusado
- [ ] Ver erro se cartão inválido
- [ ] Tentar novamente após erro
- [ ] Ver número do pedido imediatamente

### Regras de Negócio do Checkout
- [x] Pedido precisa ter cliente vinculado
- [x] Pedido precisa ter endereço vinculado
- [x] Pedido precisa ter método de envio
- [x] Pedido precisa ter forma de pagamento
- [x] Pagamento confirmado no servidor (não no navegador)
- [x] Status inicial do pedido é "pendente"
- [x] Após pagamento: "pago" ou "aguardando receita"
- [ ] CPF deve ser válido
- [ ] CEP deve existir
- [ ] Telefone deve ter formato brasileiro
- [ ] Estoque deve ser validado antes de pagar
- [ ] Estoque reservado durante checkout
- [ ] Reserva expira após 15 minutos sem pagar
- [ ] PIX expira após 30 minutos
- [ ] Boleto vence em 3 dias úteis
- [ ] Parcela mínima R$ 50

### Regras de Segurança do Checkout
- [ ] **CRÍTICO: Verificar que cliente é dono do pedido**
- [ ] **CRÍTICO: Impedir acesso ao checkout de outro cliente**
- [ ] Proteger dados durante envio (HTTPS)
- [ ] Limitar tentativas de pagamento (máx 3 por minuto)
- [ ] Bloquear após muitas falhas

---

## Pagamento

### Funcionalidades de Criação
- [x] Criar intenção de pagamento no Stripe
- [x] Incluir valor total do pedido
- [x] Incluir dados do pedido
- [x] Retornar código de segurança para pagamento
- [x] Armazenar ID do pagamento no pedido

### Funcionalidades de Métodos Suportados
- [x] Cartão de crédito (Visa, Mastercard, Amex)
- [ ] Cartão de débito
- [ ] PIX
- [ ] Boleto
- [ ] Apple Pay
- [ ] Google Pay
- [ ] Parcelamento sem juros (até 6x)
- [ ] Parcelamento com juros (7x a 12x)

### Funcionalidades de Confirmação
- [x] Confirmar pagamento de forma segura no servidor
- [x] Validar que pagamento foi aprovado
- [x] Atualizar status do pedido para "pago"
- [x] Atualizar status do pagamento
- [x] Enviar email de confirmação
- [ ] Tentar novamente em caso de erro
- [ ] Evitar cobranças duplicadas
- [ ] Registrar todas as tentativas

### Funcionalidades de Notificações Automáticas
- [x] Receber notificação do Stripe quando pagamento aprovado
- [x] Receber notificação quando pagamento falha
- [x] Validar que notificação é legítima
- [x] Processar sucesso automaticamente
- [x] Processar falha automaticamente
- [ ] Receber notificação de reembolso
- [ ] Receber notificação de disputa
- [ ] Registrar todas as notificações

### Funcionalidades Pós-Pagamento
- [x] Atualizar status baseado em receita médica
- [x] Se precisa de receita: status = "aguardando receita"
- [x] Se não precisa: status = "pago"
- [x] Enviar email com detalhes do pedido
- [x] Registrar método de pagamento usado
- [ ] **CRÍTICO: Deduzir estoque dos produtos comprados**
- [ ] Notificar admin sobre novo pedido
- [ ] Gerar nota fiscal

### Funcionalidades de Falha
- [x] Atualizar status para "falhou"
- [x] Registrar detalhes da falha
- [ ] Notificar cliente sobre falha
- [ ] Permitir nova tentativa
- [ ] Sugerir outro método de pagamento
- [ ] Mostrar motivo da falha

### Funcionalidades de Reembolso
- [ ] Solicitar reembolso total
- [ ] Solicitar reembolso parcial
- [ ] Processar reembolso via Stripe
- [ ] Atualizar status para "reembolsado"
- [ ] Enviar email confirmando reembolso
- [ ] Retornar estoque ao inventário
- [ ] Registrar motivo do reembolso

### Funcionalidades de Consulta
- [x] Ver status do pagamento
- [x] Ver ID do pagamento
- [ ] Ver histórico de tentativas
- [ ] Ver últimos 4 dígitos do cartão
- [ ] Ver bandeira do cartão usado

### Regras de Negócio do Pagamento
- [x] Valor do pagamento deve bater com total do pedido
- [x] Pagamento deve incluir ID do pedido
- [x] Confirmação deve ser no servidor (segurança)
- [x] Notificações devem ser validadas
- [x] Status do pedido depende se precisa de receita
- [x] Email de confirmação obrigatório após sucesso
- [ ] Um pagamento por pedido (evitar duplicatas)
- [ ] Estoque deduzido junto com confirmação
- [ ] Timeout de 30 segundos para confirmar
- [ ] Máximo 3 tentativas automáticas
- [ ] PIX válido por 30 minutos
- [ ] Boleto vence em 3 dias úteis
- [ ] Reembolso possível até 180 dias
- [ ] Reembolso deve restaurar estoque
- [ ] Notificar admin em caso de disputa
- [ ] Taxa de 2.99% + R$ 0,39 por transação

---

## Pedidos

### Funcionalidades de Histórico
- [x] Ver lista de todos os pedidos
- [x] Acessar página de pedidos
- [x] Ver apenas pedidos do cliente logado
- [ ] Ver data de cada pedido
- [ ] Ver número de cada pedido
- [ ] Ver status de cada pedido
- [ ] Ver valor total de cada pedido
- [ ] Ver quantidade de itens
- [ ] Filtrar por status
- [ ] Filtrar por data
- [ ] Buscar por número do pedido
- [ ] Ver paginação quando muitos pedidos
- [ ] Ordenar por mais recentes

### Funcionalidades de Detalhes
- [x] Ver página de detalhes do pedido
- [x] Ver número do pedido
- [x] Ver data de criação
- [x] Ver status atual
- [x] Ver todos os itens comprados
- [x] Ver foto de cada produto
- [x] Ver nome de cada produto
- [x] Ver quantidade de cada produto
- [x] Ver preço de cada produto
- [x] Ver opções de lente
- [x] Ver endereço de entrega
- [x] Ver método de envio
- [x] Ver forma de pagamento
- [x] Ver subtotal
- [x] Ver custo do frete
- [x] Ver desconto (se houver)
- [x] Ver total pago
- [x] Ver linha do tempo do pedido
- [ ] Ver código de rastreamento
- [ ] Rastrear pedido diretamente
- [ ] Ver histórico de mudanças de status
- [ ] Ver notas do pedido
- [ ] Baixar nota fiscal
- [ ] Solicitar suporte sobre o pedido

### Funcionalidades de Status
- [x] Ver status "pendente"
- [x] Ver status "pago"
- [x] Ver status "aguardando receita"
- [x] Ver status "cancelado"
- [x] Ver linha do tempo visual
- [ ] Ver status "em produção"
- [ ] Ver status "enviado"
- [ ] Ver status "entregue"
- [ ] Ver status "reembolsado"
- [ ] Receber email ao mudar status
- [ ] Ver estimativa do próximo status

### Funcionalidades de Rastreamento
- [x] Ver informações de entrega
- [x] Ver método de entrega escolhido
- [x] Ver status da entrega
- [x] Ver prazo estimado em dias
- [x] Ver código de rastreamento (quando disponível)
- [ ] Rastrear nos Correios pelo código
- [ ] Ver atualizações em tempo real
- [ ] Ver mapa com localização
- [ ] Receber notificação quando sair para entrega
- [ ] Receber notificação quando entregue
- [ ] Ver foto da entrega

### Funcionalidades de Cancelamento
- [ ] Solicitar cancelamento do pedido
- [ ] Ver regras para cancelamento
- [ ] Ver prazo máximo para cancelar
- [ ] Confirmar solicitação
- [ ] Receber email de confirmação
- [ ] Ver status atualizado para "cancelado"
- [ ] Receber reembolso após cancelamento

### Funcionalidades de Devolução
- [ ] Solicitar devolução de produto
- [ ] Solicitar troca de produto
- [ ] Ver política de devolução
- [ ] Ver prazo para devolução (7 dias)
- [ ] Informar motivo
- [ ] Enviar fotos do produto (se defeito)
- [ ] Gerar etiqueta de postagem
- [ ] Acompanhar status da devolução
- [ ] Receber reembolso após aprovação
- [ ] Receber produto de troca

### Regras de Negócio dos Pedidos
- [x] Pedido pertence ao cliente que comprou
- [x] Histórico mostra apenas pedidos próprios
- [x] Pedido tem número único
- [x] Status segue fluxo definido
- [x] Linha do tempo mostra progresso
- [ ] Cancelamento só antes de "em produção"
- [ ] Cancelamento automático se não pagar boleto em 24h
- [ ] Cancelamento automático se não pagar PIX em 30min
- [ ] Devolução permitida até 7 dias após entrega
- [ ] Troca permitida até 30 dias após entrega
- [ ] Reembolso em até 30 dias após aprovação
- [ ] Frete grátis na devolução se defeito
- [ ] Status "em produção" quando admin iniciar
- [ ] Status "enviado" quando código informado
- [ ] Status "entregue" quando confirmado
- [ ] Notificar cliente a cada mudança
- [ ] Histórico de status é imutável
- [ ] Pedido não volta para status anterior

### Regras de Transição de Status
- [x] pendente → pago (pagamento confirmado)
- [x] pendente → aguardando receita (precisa de receita)
- [x] pendente → cancelado (não pagou)
- [ ] aguardando receita → em produção (receita aprovada)
- [ ] pago → em produção (início da produção)
- [ ] em produção → enviado (envio realizado)
- [ ] enviado → entregue (entrega confirmada)
- [ ] qualquer → cancelado (cancelamento aprovado)
- [ ] qualquer → reembolsado (reembolso processado)

---

## Cupons de Desconto

### Funcionalidades de Criação (Admin)
- [x] Criar cupom com código único
- [x] Definir tipo de desconto (percentual ou valor fixo)
- [x] Definir percentual de desconto
- [x] Definir valor fixo de desconto
- [x] Definir valor máximo de desconto
- [x] Definir data de início
- [x] Definir data de fim
- [x] Definir limite de usos
- [x] Ver quantas vezes foi usado
- [x] Ativar ou desativar cupom
- [x] Definir valor mínimo do pedido
- [ ] Definir limite por cliente
- [ ] Definir produtos específicos onde vale
- [ ] Definir categorias onde vale
- [ ] Definir se é só para primeira compra
- [ ] Definir se acumula com outras promoções

### Funcionalidades de Validação
- [x] Verificar se código existe
- [x] Verificar se cupom está ativo
- [x] Verificar se está na data de validade
- [x] Verificar se não excedeu limite de usos
- [x] Verificar se pedido atinge valor mínimo
- [x] Retornar erro específico para cada problema
- [x] Código não diferencia maiúsculas/minúsculas
- [ ] Verificar se cliente já usou
- [ ] Verificar se produtos são elegíveis
- [ ] Verificar se cliente é elegível

### Funcionalidades de Aplicação
- [x] Aplicar cupom ao pedido
- [x] Remover cupom do pedido
- [x] Vincular cupom ao pedido
- [x] Calcular desconto corretamente
- [x] Aplicar desconto percentual
- [x] Aplicar desconto fixo
- [x] Respeitar valor máximo de desconto
- [x] Incrementar contador de uso
- [x] Atualizar total do pedido
- [ ] Mostrar quanto economizou
- [ ] Mostrar prévia antes de aplicar
- [ ] Validar novamente ao pagar

### Funcionalidades de Interface
- [ ] Ver campo para digitar código
- [ ] Ver botão "Aplicar"
- [ ] Ver mensagem de sucesso
- [ ] Ver valor do desconto
- [ ] Ver código aplicado
- [ ] Remover cupom aplicado
- [ ] Ver erro claro quando inválido
- [ ] Ver motivo específico da invalidação

### Regras de Negócio dos Cupons
- [x] Apenas um cupom por pedido
- [x] Código único e não diferencia maiúsculas
- [x] Precisa estar ativo
- [x] Precisa estar dentro da validade
- [x] Uso não pode exceder limite
- [x] Pedido precisa atingir valor mínimo
- [x] Desconto percentual: valor × (percentual / 100)
- [x] Desconto final é o menor entre calculado e máximo
- [x] Contador incrementa ao aplicar
- [x] Desconto aplicado no subtotal
- [ ] Cupom expirado retorna erro específico
- [ ] Cupom esgotado retorna erro específico
- [ ] Valor mínimo não atingido retorna erro específico
- [ ] Revalidar cupom ao pagar
- [ ] Decrementar uso se pedido cancelado

---

## Prescrição Médica

### Funcionalidades de Identificação
- [x] Produto tem marcação se precisa de receita
- [x] Identificar se pedido tem produto que precisa de receita
- [x] Atualizar status para "aguardando receita"
- [x] Rastrear status da receita por item
- [ ] Mostrar aviso de receita na página do produto
- [ ] Mostrar aviso de receita no carrinho
- [ ] Mostrar aviso de receita no checkout
- [ ] Exigir aceite de termos sobre receita

### Funcionalidades de Upload
- [x] Enviar arquivo de receita
- [x] Armazenar arquivo
- [x] Armazenar informações da receita
- [x] Atualizar status para "enviada"
- [x] Vincular receita ao item do pedido
- [ ] Aceitar fotos (JPG, PNG)
- [ ] Aceitar PDF
- [ ] Validar tamanho máximo do arquivo
- [ ] Validar formato do arquivo
- [ ] Comprimir imagem
- [ ] Armazenar em serviço seguro
- [ ] Gerar miniatura da receita

### Funcionalidades de Interface de Upload
- [x] Página de sucesso permite upload
- [x] Link para upload no email de lembrete
- [ ] Ver campo de upload
- [ ] Ver prévia antes de enviar
- [ ] Ver progresso do upload
- [ ] Ver confirmação de sucesso
- [ ] Substituir receita enviada
- [ ] Ver instruções de como fotografar receita
- [ ] Ver exemplo de receita válida

### Funcionalidades de Lembretes
- [x] Enviar lembrete automático após 48h
- [x] Buscar pedidos aguardando há mais de 48h
- [x] Enviar email de lembrete
- [x] Registrar quando lembrete foi enviado
- [x] Email com produtos e link de upload
- [ ] Enviar segundo lembrete após 72h
- [ ] Enviar terceiro lembrete após 96h
- [ ] Cancelar pedido se não enviar em X dias
- [ ] Notificar admin sobre receitas pendentes

### Funcionalidades de Validação (Admin)
- [ ] Visualizar receita enviada
- [ ] Aprovar receita
- [ ] Rejeitar receita com motivo
- [ ] Notificar cliente se rejeitada
- [ ] Permitir reenvio após rejeição
- [ ] Validar data de emissão
- [ ] Validar assinatura do médico
- [ ] Verificar CRM do médico

### Regras de Negócio da Prescrição
- [x] Produto marcado como "precisa de receita"
- [x] Se qualquer item precisa, pedido aguarda receita
- [x] Status por item: não precisa, pendente, enviada
- [x] Pedido só avança com receitas válidas
- [x] Lembrete enviado após 48h
- [x] Registrar lembrete para não duplicar
- [ ] Receita deve ter menos de 1 ano
- [ ] Receita deve ter nome, data, CRM, grau
- [ ] Arquivo JPG, PNG ou PDF
- [ ] Máximo 10MB
- [ ] Resolução mínima 800x600
- [ ] Validação de CRM via API oficial
- [ ] Máximo 3 reenvios após rejeição
- [ ] Após 3 rejeições, contato manual
- [ ] Cancelamento automático se não enviar em 7 dias
- [ ] Reembolso automático após cancelamento

---

## Avaliações de Produtos

### Funcionalidades de Visualização
- [x] Estrutura para seção de avaliações na página
- [ ] Ver seção de avaliações
- [ ] Ver nota média (1-5 estrelas)
- [ ] Ver quantidade total de avaliações
- [ ] Ver distribuição das notas (quantas 5 estrelas, etc.)
- [ ] Ver lista de avaliações
- [ ] Ver nome de quem avaliou
- [ ] Ver data da avaliação
- [ ] Ver nota dada
- [ ] Ver comentário
- [ ] Ver fotos enviadas
- [ ] Ver selo "Compra Verificada"

### Funcionalidades de Interação
- [ ] Marcar avaliação como útil (curtir)
- [ ] Ordenar por mais recentes
- [ ] Ordenar por mais úteis
- [ ] Filtrar por nota
- [ ] Ver mais avaliações (paginação)

### Funcionalidades de Criação
- [ ] Escrever avaliação após compra confirmada
- [ ] Dar nota de 1 a 5 estrelas
- [ ] Escrever comentário
- [ ] Adicionar fotos do produto
- [ ] Ver prévia antes de enviar
- [ ] Editar avaliação enviada
- [ ] Remover avaliação enviada

### Funcionalidades de Notificação
- [ ] Receber email pedindo avaliação após entrega
- [ ] Receber lembrete se não avaliar

### Regras de Negócio das Avaliações
- [ ] Apenas quem comprou pode avaliar
- [ ] Uma avaliação por cliente por produto
- [ ] Nota deve ser entre 1 e 5
- [ ] Comentário opcional
- [ ] Fotos opcionais
- [ ] Máximo 5 fotos por avaliação
- [ ] Foto máximo 5MB
- [ ] Avaliação passa por moderação antes de publicar
- [ ] Média recalculada a cada nova avaliação
- [ ] Email enviado 7 dias após entrega
- [ ] Lembrete enviado 14 dias após entrega

---

## Lista de Desejos

### Funcionalidades de Gerenciamento
- [ ] Adicionar produto à lista
- [ ] Remover produto da lista
- [ ] Ver lista na página da conta
- [ ] Mover produto da lista para carrinho
- [ ] Ver quantos itens na lista
- [ ] Limpar lista completamente

### Funcionalidades de Notificação
- [ ] Receber email quando produto entrar em promoção
- [ ] Receber email quando produto voltar ao estoque
- [ ] Escolher receber ou não notificações

### Funcionalidades de Compartilhamento
- [ ] Compartilhar lista via link
- [ ] Gerar link único para lista
- [ ] Permitir que outros vejam a lista

### Regras de Negócio da Lista de Desejos
- [ ] Requer conta para ter lista
- [ ] Lista salva no servidor
- [ ] Não tem limite de itens
- [ ] Produto pode estar em lista e carrinho
- [ ] Verificar estoque ao mover para carrinho
- [ ] Email de promoção só se desconto > 10%
- [ ] Email de estoque só se cliente habilitou
- [ ] Link compartilhável expira em 30 dias

---

## Emails e Notificações

### Funcionalidades de Templates Existentes
- [x] Email de confirmação de pagamento
- [x] Email de pedido criado
- [x] Email de link para registro
- [x] Email de redefinição de senha
- [x] Email de lembrete de receita

### Funcionalidades de Conteúdo
- [x] Logo da empresa no topo
- [x] Nome do cliente
- [x] Número do pedido
- [x] Data do pedido
- [x] Lista de produtos com fotos
- [x] Quantidades
- [x] Preços
- [x] Opções de lente
- [x] Subtotal
- [x] Frete
- [x] Descontos
- [x] Total pago
- [x] Endereço de entrega
- [x] Código de rastreamento
- [x] Link para upload de receita
- [x] Informações de contato
- [ ] Número da nota fiscal
- [ ] Link para rastrear pedido
- [ ] Prazo de entrega
- [ ] Botão de suporte

### Funcionalidades de Configuração
- [x] Integração com serviço de email (Resend)
- [x] Email remetente configurado
- [x] Templates em formato React
- [x] Visualização de templates em desenvolvimento
- [ ] Domínio verificado para entregabilidade
- [ ] Configuração SPF e DKIM
- [ ] Monitorar taxa de entrega
- [ ] Monitorar emails que voltaram
- [ ] Monitorar reclamações de spam

### Problema Crítico
- [ ] **CORRIGIR: Emails sendo enviados para endereço de teste, não para cliente real**

### Funcionalidades de Emails Faltantes
- [ ] Email de boas-vindas
- [ ] Email de pedido enviado com rastreamento
- [ ] Email de pedido entregue
- [ ] Email de pedido cancelado
- [ ] Email de reembolso processado
- [ ] Email de receita aprovada
- [ ] Email de receita rejeitada
- [ ] Email de carrinho abandonado (24h)
- [ ] Email de carrinho abandonado (48h)
- [ ] Email de carrinho abandonado com cupom (72h)
- [ ] Email de produto voltou ao estoque
- [ ] Email de produto em promoção (lista de desejos)
- [ ] Email pedindo avaliação
- [ ] Newsletter

### Funcionalidades de Notificações Admin
- [ ] Notificar sobre novo pedido
- [ ] Notificar sobre pagamento recebido
- [ ] Notificar sobre receita pendente
- [ ] Notificar sobre estoque baixo
- [ ] Notificar sobre produto esgotado
- [ ] Notificar sobre disputa de pagamento

### Funcionalidades de Outros Canais
- [ ] SMS de confirmação
- [ ] SMS de pedido enviado
- [ ] SMS de pedido entregue
- [ ] Notificação push no navegador
- [ ] Integração com WhatsApp

### Regras de Negócio de Emails
- [x] Emails usam templates padronizados
- [x] Emails enviados via serviço confiável
- [x] Email de confirmação após pagamento
- [x] Email de lembrete 48h após pedido sem receita
- [x] Remetente padrão da empresa
- [x] Preços formatados em Reais
- [x] Produtos agrupados (óculos + lentes)
- [ ] **CRÍTICO: Usar email real do cliente**
- [ ] Link de descadastro obrigatório em marketing
- [ ] Remover email se bounce permanente
- [ ] Tentar 3x se bounce temporário
- [ ] Remover se reclamação de spam
- [ ] Rastrear aberturas e cliques
- [ ] Não enviar de madrugada (horário otimizado)
- [ ] Máximo 100 emails por minuto
- [ ] Cupom no email é único e rastreável

---

## Painel Administrativo

### Funcionalidades de Estrutura
- [x] Layout dedicado para admin
- [x] Menu lateral de navegação
- [x] Proteção de acesso (requer login)
- [x] Indicadores de carregamento
- [x] Design responsivo
- [x] Navegação entre seções

### Funcionalidades de Seções
- [x] Seção de Pedidos
- [x] Seção de Produtos
- [x] Seção de Clientes
- [x] Seção de Categorias
- [x] Seção de Atividades

### Funcionalidades de Pedidos
- [x] Ver tabela de pedidos
- [x] Ver ID do pedido
- [x] Ver nome do cliente
- [x] Ver data de criação
- [x] Ver status do pedido
- [x] Ver status do pagamento
- [x] Ver status da entrega
- [x] Ver quantidade de produtos
- [x] Ver valor total
- [x] Ver estatísticas de pedidos
- [x] Formulário para criar pedido
- [ ] **FALTANDO: Conexão com dados reais (atualmente dados fictícios)**
- [ ] Filtrar por status
- [ ] Filtrar por data
- [ ] Filtrar por cliente
- [ ] Buscar por ID ou nome
- [ ] Ordenar colunas
- [ ] Paginação
- [ ] Ver detalhes completos
- [ ] Atualizar status
- [ ] Adicionar código de rastreamento
- [ ] Enviar email ao cliente
- [ ] Cancelar pedido
- [ ] Processar reembolso
- [ ] Ver receita enviada
- [ ] Aprovar/rejeitar receita
- [ ] Adicionar notas internas
- [ ] Exportar para Excel/CSV
- [ ] Imprimir detalhes
- [ ] Ver vendas totais
- [ ] Ver pedidos por período
- [ ] Ver ticket médio

### Funcionalidades de Produtos
- [x] Ver tabela de produtos
- [x] Ver nome
- [x] Ver URL amigável
- [x] Ver descrição curta
- [x] Ver estoque
- [x] Ver status (ativo/inativo)
- [x] Ver data de criação
- [x] Botões de editar/excluir
- [x] Ver estatísticas
- [x] Formulário para criar produto
- [ ] **FALTANDO: Conexão com dados reais**
- [ ] Criar produto completo
- [ ] Upload de fotos
- [ ] Definir foto principal
- [ ] Reordenar fotos
- [ ] Excluir fotos
- [ ] Editar produto
- [ ] Excluir produto
- [ ] Ativar/desativar
- [ ] Gerenciar preços
- [ ] Definir desconto
- [ ] Ajustar estoque
- [ ] Ver histórico de estoque
- [ ] Cadastrar opções de lente
- [ ] Vincular lentes ao óculos
- [ ] Filtrar por categoria
- [ ] Filtrar por status
- [ ] Buscar por nome
- [ ] Ordenar colunas
- [ ] Paginação
- [ ] Duplicar produto
- [ ] Importar via Excel
- [ ] Exportar para Excel
- [ ] Ver produtos com estoque baixo
- [ ] Ver produtos esgotados
- [ ] Alerta de estoque baixo

### Funcionalidades de Clientes
- [x] Ver tabela de clientes
- [x] Ver nome
- [x] Ver email
- [x] Ver telefone
- [x] Ver data de cadastro
- [x] Botões de editar/excluir
- [x] Ver estatísticas
- [x] Formulário para criar cliente
- [ ] **FALTANDO: Conexão com dados reais**
- [ ] Criar cliente
- [ ] Editar cliente
- [ ] Excluir cliente
- [ ] Ver endereços
- [ ] Ver histórico de pedidos
- [ ] Ver total gasto
- [ ] Ver última compra
- [ ] Filtrar por data
- [ ] Buscar por nome ou email
- [ ] Ordenar colunas
- [ ] Paginação
- [ ] Exportar para Excel
- [ ] Enviar email
- [ ] Adicionar notas
- [ ] Ver total de clientes
- [ ] Ver novos clientes por período

### Funcionalidades de Categorias
- [x] Ver tabela de categorias
- [x] Formulário para criar categoria
- [ ] **FALTANDO: Conexão com dados reais**
- [ ] Criar categoria
- [ ] Editar categoria
- [ ] Excluir categoria
- [ ] Definir categoria pai (subcategorias)
- [ ] Definir ordem de exibição
- [ ] Ativar/desativar
- [ ] Ver produtos da categoria
- [ ] Upload de imagem/banner

### Funcionalidades de Cupons
- [ ] Ver lista de cupons
- [ ] Criar cupom
- [ ] Editar cupom
- [ ] Excluir cupom
- [ ] Ver estatísticas de uso
- [ ] Ativar/desativar
- [ ] Duplicar cupom

### Funcionalidades de Atividades
- [x] Seção de histórico
- [x] Componente de atividades
- [ ] **FALTANDO: Registro real de ações**
- [ ] Ver log de ações
- [ ] Ver quem fez cada ação
- [ ] Ver quando foi feita
- [ ] Filtrar por tipo
- [ ] Filtrar por data
- [ ] Filtrar por usuário

### Funcionalidades de Dashboard
- [ ] Ver painel com indicadores principais
- [ ] Ver gráfico de vendas
- [ ] Ver gráfico de receita
- [ ] Ver produtos mais vendidos
- [ ] Ver categorias mais vendidas
- [ ] Ver clientes frequentes
- [ ] Ver taxa de abandono de carrinho
- [ ] Ver taxa de conversão
- [ ] Ver ticket médio
- [ ] Exportar relatórios em PDF
- [ ] Exportar relatórios em Excel
- [ ] Configurar período dos relatórios

### Funcionalidades de Configurações
- [ ] Configurar dados da loja (nome, endereço, CNPJ)
- [ ] Configurar emails
- [ ] Configurar métodos de envio
- [ ] Configurar formas de pagamento
- [ ] Configurar taxas e impostos
- [ ] Gerenciar usuários admin
- [ ] Definir permissões
- [ ] Configurar integrações
- [ ] Ver logs do sistema
- [ ] Fazer backup

### Regras de Negócio do Admin
- [x] Apenas usuários logados acessam
- [x] Layout separado com menu
- [ ] Apenas usuários com papel "admin"
- [ ] Admin tem acesso total
- [ ] Operador tem acesso limitado
- [ ] Ações registradas com data e usuário
- [ ] Exclusão de produto é soft delete
- [ ] Não excluir cliente com pedidos
- [ ] Alteração de preço cria novo registro
- [ ] Histórico de preços mantido
- [ ] Estoque não pode ser negativo
- [ ] Alerta quando estoque < 5
- [ ] Export limitado a 10.000 linhas
- [ ] Relatórios cacheados por 1 hora
- [ ] Dashboard atualiza a cada 5 minutos

---

## Moderação de Conteúdo

### Funcionalidades de Moderação de Avaliações
- [ ] Ver lista de avaliações pendentes
- [ ] Ver detalhes da avaliação
- [ ] Ver produto avaliado
- [ ] Ver cliente que avaliou
- [ ] Ver se compra foi verificada
- [ ] Aprovar avaliação
- [ ] Rejeitar avaliação com motivo
- [ ] Notificar cliente se rejeitada
- [ ] Editar avaliação (remover palavrões)
- [ ] Ver histórico de moderação
- [ ] Filtrar por status (pendente, aprovada, rejeitada)
- [ ] Buscar por produto ou cliente
- [ ] Ver estatísticas de moderação

### Funcionalidades de Moderação de Fotos
- [ ] Ver fotos enviadas em avaliações
- [ ] Aprovar foto
- [ ] Rejeitar foto
- [ ] Ver motivo de rejeição
- [ ] Filtrar fotos por status

### Regras de Negócio de Moderação
- [ ] Avaliação fica pendente até aprovar
- [ ] Avaliação com palavrões rejeitada automaticamente
- [ ] Foto com conteúdo impróprio rejeitada
- [ ] Notificar cliente sobre rejeição
- [ ] Permitir reenvio após rejeição
- [ ] Máximo 3 rejeições por avaliação
- [ ] Manter log de todas as ações
- [ ] Moderador não pode ser o próprio cliente

---

## Gestão de Estoque

### Funcionalidades de Visualização
- [ ] Ver estoque atual de cada produto
- [ ] Ver histórico de movimentações
- [ ] Ver produtos com estoque baixo
- [ ] Ver produtos esgotados
- [ ] Ver alertas de reposição

### Funcionalidades de Movimentação
- [ ] Registrar entrada de estoque
- [ ] Registrar saída de estoque
- [ ] Registrar motivo da movimentação
- [ ] Ver responsável pela movimentação
- [ ] Ver data e hora da movimentação

### Funcionalidades de Alertas
- [ ] Configurar estoque mínimo por produto
- [ ] Receber alerta quando atingir mínimo
- [ ] Receber alerta diário de itens críticos
- [ ] Ver painel de alertas ativos

### Funcionalidades de Reserva
- [ ] Reservar estoque ao adicionar no carrinho
- [ ] Liberar reserva se carrinho expirar
- [ ] Liberar reserva se pedido cancelado
- [ ] Ver estoque reservado vs disponível
- [ ] Configurar tempo de reserva

### Funcionalidades de Relatórios
- [ ] Ver relatório de giro de estoque
- [ ] Ver produtos parados há muito tempo
- [ ] Ver previsão de reposição
- [ ] Exportar relatório de estoque

### Regras de Negócio de Estoque
- [ ] **CRÍTICO: Validar estoque antes de adicionar ao carrinho**
- [ ] **CRÍTICO: Deduzir estoque após pagamento confirmado**
- [ ] Não permitir estoque negativo
- [ ] Reserva expira após 15 minutos
- [ ] Restaurar estoque se pedido cancelado
- [ ] Restaurar estoque se reembolso processado
- [ ] Alerta quando estoque < configuração mínima
- [ ] Registrar toda movimentação com motivo
- [ ] Apenas admin pode ajustar estoque manualmente
- [ ] Histórico de estoque é imutável

---

## Segurança

### Funcionalidades Implementadas
- [x] Login com sessões seguras
- [x] Sessões expiram automaticamente
- [x] IP registrado em cada sessão
- [x] Controle de acesso por papel (admin/cliente)
- [x] Rotas protegidas por autenticação
- [x] Validação de notificações do Stripe
- [x] Chaves secretas apenas no servidor
- [x] Validação de dados em todas as APIs
- [x] Proteção contra SQL injection
- [x] Variáveis de ambiente seguras
- [x] Separação de dados cliente/servidor
- [x] Jobs agendados com autenticação

### Problemas Críticos de Segurança
- [ ] **CRÍTICO: Checkout não verifica se cliente é dono do pedido**
- [ ] **CRÍTICO: Qualquer pessoa pode acessar checkout de outro**
- [ ] **CRÍTICO: Dados pessoais expostos sem verificação**
- [ ] **ALTO: Sem limite de tentativas em pagamento**
- [ ] **ALTO: Sem limite de tentativas em login**
- [ ] **ALTO: Carrinho vulnerável a abuso**
- [ ] **ALTO: Cadastro vulnerável a spam/robôs**

### Funcionalidades Faltantes
- [ ] Verificar propriedade do pedido no checkout
- [ ] Limitar tentativas em APIs sensíveis
- [ ] Proteção contra CSRF em formulários
- [ ] Headers de segurança (CSP, XSS)
- [ ] Sanitização de dados de entrada
- [ ] Prevenção de injeção de scripts
- [ ] HTTPS obrigatório
- [ ] Rotação periódica de chaves
- [ ] Log de eventos de segurança
- [ ] Auditoria de ações admin
- [ ] Autenticação em dois fatores para admin
- [ ] Criptografia de dados sensíveis
- [ ] Mascarar dados pessoais em logs
- [ ] Política de senhas fortes
- [ ] Bloqueio após tentativas falhadas
- [ ] CAPTCHA em formulários críticos
- [ ] Detecção de atividade suspeita

### Regras de Negócio de Segurança
- [x] Sessão expira após inatividade
- [x] Notificações validadas criptograficamente
- [x] Queries parametrizadas (anti-injection)
- [x] Variáveis de ambiente não vazam para cliente
- [ ] Usuário deve ser dono do recurso para acessar
- [ ] Máximo 10 tentativas de pagamento por minuto
- [ ] Máximo 5 tentativas de login por minuto
- [ ] Máximo 3 cadastros por minuto
- [ ] Bloquear IP após 10 tentativas falhadas
- [ ] Senha mínima 8 caracteres com letras e números
- [ ] Dados pessoais não aparecem em logs
- [ ] Dados sensíveis criptografados
- [ ] HTTPS obrigatório (redirecionar HTTP)
- [ ] Token CSRF obrigatório em formulários
- [ ] Admin precisa de 2FA para ações críticas
- [ ] Log de auditoria imutável
- [ ] Backup criptografado diário

---

## Legal e Compliance

### Funcionalidades de Documentos Legais
- [ ] Página de Política de Privacidade
- [ ] Página de Termos de Uso
- [ ] Página de Política de Cookies
- [ ] Página de Política de Devolução
- [ ] Página de Política de Entrega
- [ ] Ver versão atual de cada documento
- [ ] Ver data da última atualização

### Funcionalidades de Consentimento
- [ ] Banner de cookies
- [ ] Aceitar cookies obrigatórios
- [ ] Aceitar/recusar cookies opcionais
- [ ] Salvar preferências de cookies
- [ ] Aceitar termos ao criar conta
- [ ] Aceitar termos ao finalizar compra
- [ ] Registrar aceite de termos

### Funcionalidades de LGPD
- [ ] Solicitar cópia dos dados pessoais
- [ ] Receber dados em formato legível
- [ ] Solicitar exclusão dos dados
- [ ] Solicitar correção dos dados
- [ ] Ver finalidade do uso dos dados
- [ ] Revogar consentimento

### Funcionalidades Fiscais
- [ ] Gerar Nota Fiscal Eletrônica (NF-e)
- [ ] Enviar NF-e por email
- [ ] Armazenar NF-e no pedido
- [ ] Integração com sistema fiscal
- [ ] Cálculo de impostos por região
- [ ] Emissão de DANFE

### Regras de Negócio Legal
- [ ] Política de Privacidade obrigatória
- [ ] Termos de Uso obrigatórios
- [ ] Consentimento de cookies obrigatório
- [ ] Responder LGPD em até 15 dias
- [ ] Exportação de dados em formato JSON
- [ ] Exclusão completa dos dados pessoais
- [ ] Manter dados fiscais por 5 anos
- [ ] NF-e emitida em até 24h após pagamento
- [ ] Devolução em até 7 dias (CDC)
- [ ] Informar CNPJ no site
- [ ] Informar endereço físico no site
- [ ] SAC disponível para contato

---

## Infraestrutura

### Funcionalidades de Desenvolvimento
- [x] Comando para iniciar servidor local
- [x] Comando para criar build de produção
- [x] Comando para verificar código (linter)
- [x] Comando para corrigir código automaticamente
- [x] Comando para atualizar banco de dados
- [x] Comando para gerar migrações
- [x] Comando para visualizar banco de dados
- [x] Comando para popular banco com dados de teste
- [x] Comando para resetar banco de dados
- [x] Comando para testar pagamentos localmente
- [x] Comando para visualizar emails localmente

### Funcionalidades de Banco de Dados
- [x] Banco PostgreSQL na nuvem
- [x] ORM com tipagem segura
- [x] Schema definido em código
- [x] Migrações versionadas
- [x] Script de dados de teste
- [ ] Backup automático diário
- [ ] Restauração de backup
- [ ] Monitoramento de performance

### Funcionalidades de Integrações
- [x] Stripe para pagamentos
- [x] Resend para emails
- [x] Google para login
- [x] Neon para banco de dados
- [ ] Melhor Envio para frete
- [ ] Correios para rastreamento
- [ ] CDN para arquivos estáticos
- [ ] Armazenamento de arquivos (S3, R2)
- [ ] Analytics (Google Analytics, etc.)
- [ ] Monitoramento de erros (Sentry)
- [ ] Monitoramento de uptime

### Funcionalidades de Produção
- [ ] Ambiente de produção configurado
- [ ] Variáveis de ambiente de produção
- [ ] Domínio personalizado
- [ ] Certificado SSL/HTTPS
- [ ] Configuração de DNS
- [ ] CDN configurado
- [ ] Cache configurado
- [ ] Monitoramento configurado
- [ ] Alertas configurados
- [ ] Pipeline de deploy automático
- [ ] Testes antes de deploy
- [ ] Rollback automático em caso de falha
- [ ] Deploy sem downtime

### Funcionalidades de Performance
- [ ] Otimização de imagens
- [ ] Carregamento sob demanda de componentes
- [ ] Divisão de código
- [ ] Cache de respostas de API
- [ ] Pré-carregamento de dados importantes
- [ ] Funcionar offline (Service Worker)
- [ ] Funcionalidades de PWA
- [ ] Monitoramento de performance

### Regras de Negócio de Infraestrutura
- [x] ORM garante segurança de tipos
- [x] Linter obrigatório
- [x] TypeScript com modo estrito
- [x] Código sensível apenas no servidor
- [ ] CI deve rodar lint + build + testes
- [ ] Deploy só se CI passar
- [ ] Ambiente de staging obrigatório
- [ ] Feature flags para lançamento gradual
- [ ] Migração de banco antes de deploy
- [ ] Rollback se health check falhar
- [ ] Logs centralizados
- [ ] Tempo de resposta < 200ms
- [ ] Uptime 99.9%
- [ ] Recuperação em até 4 horas
- [ ] Perda máxima de dados: 1 hora
- [ ] Backup diário às 3AM
- [ ] Manter 30 dias de backups
- [ ] SSL com nota A+
- [ ] CDN para arquivos estáticos
- [ ] Compressão de dados habilitada

---

## Resumo Geral

### Funcionalidades por Status

**Implementadas (Prontas para uso):**
- Autenticação completa (email, Google, magic link)
- Carrinho funcional com persistência
- Checkout em etapas
- Pagamento via Stripe (cartão)
- Sistema de cupons
- Upload de prescrição
- Lembretes automáticos
- Emails de confirmação
- Estrutura do painel admin

**Parcialmente Implementadas (Precisam completar):**
- Painel admin (tem interface, falta backend real)
- Avaliações (tem estrutura, falta funcionalidade)
- Lista de desejos (não implementada)
- Gestão de estoque (não implementada)
- Moderação (não implementada)

**Críticas para Lançamento:**
1. **SEGURANÇA:** Verificar propriedade do pedido no checkout
2. **ESTOQUE:** Validar e deduzir estoque
3. **EMAIL:** Enviar para cliente real (não teste)
4. **ADMIN:** Conectar com dados reais
5. **LEGAL:** Políticas de privacidade e termos

---

## Análise do Contrato

### 📋 Obrigações Contratuais Pendentes

**⚠️ CRÍTICO - Estava no contrato e NÃO foi implementado:**

1. **Prova Virtual com IA e Renderização 3D** (~80-120h)
   - Análise facial por IA
   - Renderização 3D dos óculos
   - Prova virtual em tempo real
   - **Status:** Não iniciado

2. **Sistema de Afiliados** (~8-12h)
   - Vincular cupons a afiliados específicos
   - Rastrear vendas por afiliado
   - Flag para controle de repasse (manual)
   - Relatório de vendas por afiliado
   - **Status:** Não iniciado

3. **PIX e Boleto** (~12-20h)
   - Integração PIX via Stripe ou outro gateway
   - Geração de boleto bancário
   - **Status:** Não iniciado, obrigatório pelo contrato

4. **Filtros de Produtos** (~4-6h)
   - Filtrar por categoria
   - Filtrar por preço
   - Filtrar por características
   - **Status:** Não iniciado

### ✅ Entregue Conforme Contrato

- [x] Catálogo de produtos
- [x] Páginas de detalhes com imagens
- [x] Carrinho de compras completo
- [x] Checkout funcional
- [x] Contas de usuário
- [x] Histórico de pedidos
- [x] Gerenciamento de estoque (estrutura)
- [x] Integração Stripe (cartão)
- [x] Design responsivo
- [x] HTTPS e segurança básica
- [x] Botão WhatsApp

### 🎁 Entregue Extra (Não estava no contrato)

- Sistema de cupons de desconto
- Sistema de prescrições/receitas médicas
- Lembretes automáticos de prescrição
- Emails transacionais
- Sistema de lentes com grau (pai/filho)
- Login com Google
- Login com Magic Link
- Múltiplos endereços por cliente
- Painel administrativo completo

---

## Priorização para Lançamento

**Contexto**: Equipe de 1 dev, estoque físico pronto, volume baixo esperado (1-10 pedidos/dia)
**Prazo:** Janeiro 2026 (~2 meses)

### 🚨 OBRIGATÓRIO PELO CONTRATO (~100-160h)

**Prova Virtual com IA e 3D** (~80-120h) ⚠️ MAIOR RISCO
1. [ ] Pesquisar e escolher biblioteca de detecção facial
2. [ ] Implementar captura de câmera do usuário
3. [ ] Integrar análise facial (pontos de referência)
4. [ ] Configurar renderização 3D dos óculos
5. [ ] Posicionar óculos 3D no rosto em tempo real
6. [ ] Permitir usuário tirar foto com prova virtual
7. [ ] Otimizar performance em dispositivos móveis

**Sistema de Afiliados** (~8-12h)
8. [ ] Adicionar campo `affiliateId` na tabela de cupons
9. [ ] Criar tabela de afiliados (nome, contato, dados bancários)
10. [ ] Vincular cupom a afiliado específico
11. [ ] Registrar afiliado no pedido quando cupom usado
12. [ ] Adicionar flag `affiliatePaid` no pedido
13. [ ] Criar relatório de vendas por afiliado no admin
14. [ ] Marcar repasse como realizado (manual)

**PIX e Boleto** (~12-20h)
15. [ ] Pesquisar gateway que suporte PIX/Boleto (Stripe BR, PagSeguro, Mercado Pago)
16. [ ] Integrar API de geração de PIX
17. [ ] Exibir QR Code e código copia-cola
18. [ ] Integrar API de geração de boleto
19. [ ] Exibir PDF do boleto para download
20. [ ] Webhook para confirmar pagamento PIX/Boleto
21. [ ] Atualizar status do pedido automaticamente

**Filtros de Produtos** (~4-6h)
22. [ ] Implementar filtro por categoria
23. [ ] Implementar filtro por faixa de preço
24. [ ] Implementar busca por texto
25. [ ] Persistir filtros na URL

### 🚫 Bloqueia Lançamento - Bugs Críticos (~6h)

26. [ ] Corrigir email enviando para teste ao invés do cliente (~5 min)
27. [ ] Verificar propriedade do pedido no checkout (segurança) (~30 min)
28. [ ] Validar estoque disponível antes da compra (~1-2h)
29. [ ] Deduzir estoque após pagamento confirmado (~1-2h)
30. [ ] Conectar painel admin com dados reais (~4h)

### ⚖️ LGPD Obrigatório (Legal - ~5h)

31. [ ] Criar página de Política de Privacidade (~2h)
32. [ ] Criar página de Termos de Uso (~2h)
33. [ ] Adicionar checkbox de consentimento no cadastro (~30 min)
34. [ ] Opção de solicitar exclusão de conta (via suporte) (~30 min)

### 📦 Operação Básica (Recomendado - ~8h)

35. [ ] Atualizar status de pedido pelo admin (~2h)
36. [ ] Adicionar código de rastreamento ao pedido (~2h)
37. [ ] Email de pedido enviado/despachado (~2h)
38. [ ] CRUD de produtos no admin (editar preços, imagens) (~4h)

### 🎯 Pode Postergar (Pós-lançamento)

- [ ] Cálculo dinâmico de frete (usar frete fixo por região)
- [ ] Emails de carrinho abandonado
- [ ] Edição de endereços na conta
- [ ] Parcelamento
- [ ] Rate limiting avançado
- [ ] 2FA para admin

**⏰ TEMPO TOTAL ESTIMADO: 120-200 horas de trabalho**

**📅 Com 8 horas/semana:**
- Melhor cenário (120h): **15 semanas** (~3.5 meses)
- Pior cenário (200h): **25 semanas** (~6 meses)
- **Previsão realista: 4-5 meses** (Março-Abril 2026)

⚠️ **ALERTA:** Prazo de Janeiro 2026 é INVIÁVEL com 8h/semana. Faltam ~8 semanas, seriam apenas 64 horas disponíveis.

---

### 🔄 CENÁRIO ALTERNATIVO: Sem Prova Virtual

**Se cliente concordar em adiar Prova Virtual + IA para depois de Janeiro:**

| Item | Horas |
|------|-------|
| Sistema de Afiliados | 8-12h |
| PIX e Boleto | 12-20h |
| Filtros de Produtos | 4-6h |
| Bugs Críticos | 6h |
| LGPD | 5h |
| Operação Básica | 8h |
| **TOTAL** | **43-57h** |

**📅 Com 8 horas/semana:**
- Melhor cenário (43h): **5.5 semanas**
- Pior cenário (57h): **7 semanas**
- **Previsão realista: 6-7 semanas** ✅

✅ **VIÁVEL para Janeiro 2026!** Sobram 1-2 semanas de margem.

**Proposta para novo contrato:**
1. Lançar em Janeiro 2026 SEM Prova Virtual
2. Prova Virtual + IA como **Fase 2** (pós-lançamento)
3. Negociar valor adicional ou prazo estendido para Fase 2

---

## Funcionalidades Pós-Lançamento (Fase 2)

### SEO Avançado
- [ ] Open Graph tags para compartilhamento em redes sociais
- [ ] Twitter Cards meta tags
- [ ] Schema markup para produtos (JSON-LD structured data)
- [ ] Schema markup para organização/empresa
- [ ] Breadcrumbs com marcação estruturada
- [ ] Canonical URLs em todas as páginas
- [ ] Hreflang tags (se houver versões em outros idiomas)

### Performance Avançada
- [ ] Service Worker para cache offline
- [ ] Otimização de carregamento de fontes (font-display: swap)
- [ ] Code splitting avançado por rota
- [ ] Preload de recursos críticos
- [ ] Otimização de Core Web Vitals (LCP, FID, CLS)
- [ ] Lighthouse score >90
- [ ] Imagens em formato WebP/AVIF
- [ ] CDN para assets estáticos

### Outras Funcionalidades Futuras
- [ ] Prova Virtual com IA e Renderização 3D
- [ ] Medição facial das medidas oculares
- [ ] Cálculo dinâmico de frete (integração com transportadora)
- [ ] Sistema de avaliações de produtos
- [ ] Emails de carrinho abandonado
- [ ] Programa de fidelidade
- [ ] Dashboard personalizado com métricas
- [ ] Analytics avançado
- [ ] Lista de desejos
- [ ] 2FA para admin
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Chat ao vivo integrado

---

## Perguntas Pendentes para o Cliente

**Prazo de lançamento:** Janeiro 2026 (temos ~2 meses)

### ✅ Já Respondidas

**3. Receitas e Prescrições**
- **Resposta:** Aceitar automaticamente, suporte entra em contato via WhatsApp/email se precisar nova receita ou tirar dúvidas
- **Impacto:** Não precisa fluxo de aprovação no admin, apenas visualização

**4. Pagamentos**
- **Resposta:** Novo CNPJ específico para o e-commerce
- **Impacto:** Configurar Stripe com dados do novo CNPJ

**8. Nota Fiscal**
- **Resposta:** Já têm sistema para ótica física, mas melhor gerar manualmente ou integrar sistema diferente
- **Impacto:** Por enquanto, emitir NF manualmente fora do sistema

**10. Urgência**
- **Resposta:** O mais rápido possível (meta: Janeiro 2026)
- **Impacto:** Focar apenas no essencial para lançar

---

### ❓ Pendentes (Perguntar ao Cliente)

**1. Logística e Entregas** ⚠️ CRÍTICA
> Como vocês pretendem fazer as entregas?

- a) Correios (PAC/SEDEX) - Vocês levam à agência
- b) Transportadora com coleta (ex: Jadlog, Total Express)
- c) Integração com gateway de frete (ex: Melhor Envio, Frenet, Kangu)
- d) Apenas entrega local/retirada na loja
- e) Não sabemos ainda

**Recomendação:** Opção C (gateway de frete) automatiza cotação, etiquetas e rastreamento. Tempo extra: ~4-8h de dev.

---

**2. Estoque** ⚠️ CRÍTICA
> As armações vendidas online serão do mesmo estoque da loja física?

- a) Sim, mesmo estoque (precisa sincronização manual ou integração)
- b) Não, estoque separado para online (mais simples)
- c) Alguns produtos compartilhados, outros exclusivos

**Impacto:** Define se precisa atualizar estoque em dois lugares ou apenas no e-commerce.

---

**5. Atendimento**
> Quem vai responder dúvidas e problemas dos clientes online?

- a) Mesmo time da loja física
- b) Pessoa dedicada ao online
- c) WhatsApp da loja (número específico)
- d) Email específico para e-commerce

**Impacto:** Definir canais de contato no rodapé e página de ajuda.

---

**6. Prazos de Produção**
> Qual o prazo de produção das lentes com grau?

- a) 3-5 dias úteis
- b) 7-10 dias úteis
- c) 10-15 dias úteis
- d) Depende do laboratório parceiro

**Impacto:** Informar cliente sobre prazo total = produção + envio.

---

**7. Trocas e Devoluções**
> Qual a política de trocas/devoluções?

- a) Seguir CDC (7 dias arrependimento obrigatório)
- b) 30 dias para troca
- c) Sem devolução para lentes com grau (produto personalizado)
- d) Combinação: 7 dias para armação, sem devolução para lentes personalizadas

**Impacto:** Escrever página de Política de Trocas (requisito LGPD).

---

**9. Frete Grátis**
> Terão política de frete grátis?

- a) Sim, acima de R$ X (qual valor?)
- b) Sim, para região específica (qual região?)
- c) Não, cliente sempre paga frete
- d) Ainda não definido

**Impacto:** Implementar regra no checkout se aplicável.

---

**11. Dados Bancários** (NOVO)
> O novo CNPJ já tem conta bancária aberta?

- a) Sim, conta PJ já aberta
- b) Não, ainda precisa abrir
- c) Em processo de abertura

**Impacto:** Necessário para configurar Stripe e receber pagamentos.

---

**12. Domínio e Hospedagem** (NOVO)
> Já compraram domínio para o e-commerce?

- a) Sim, já temos (qual?)
- b) Não, ainda precisa comprar
- c) Vamos usar subdomínio da ótica

**Impacto:** Configurar DNS, SSL e deploy em produção.

---

> **Nota**: Atualizar este documento conforme funcionalidades forem implementadas. Marcar `[x]` quando concluído.
>
> **Última atualização**: 15 de Novembro de 2025
