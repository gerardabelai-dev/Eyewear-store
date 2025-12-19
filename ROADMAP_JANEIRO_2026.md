# Roadmap de Lançamento - Janeiro 2026

> **Objetivo:** Lançar e-commerce Dr. Vista funcional até Janeiro 2026
>
> **Contexto:** 8 horas/semana disponíveis, ~8 semanas até o prazo
>
> **Horas disponíveis:** 64 horas | **Horas necessárias:** 57-79 horas

---

## Tarefas para Lançamento

### 🚨 OBRIGATÓRIO PELO CONTRATO

#### Sistema de Afiliados (~10-14h)
- [ ] Criar cadastro de afiliados (nome, email, telefone, dados bancários)
- [ ] Criar tela de listagem de afiliados no painel admin
- [ ] Permitir editar e desativar afiliados
- [ ] Criar tela de listagem de cupons no painel admin
- [ ] Permitir criar cupom vinculado a um afiliado
- [ ] Permitir editar e desativar cupons
- [ ] Quando cliente usar cupom, registrar qual afiliado está vinculado
- [ ] Criar relatório de vendas por afiliado
- [ ] Permitir marcar se o repasse foi feito ao afiliado
- [ ] Filtrar pedidos por afiliado

#### PIX e Boleto (~12-20h)
- [ ] **Pré-requisitos (cliente precisa providenciar):**
  - [ ] Conta Stripe ativada com CNPJ do e-commerce
  - [ ] Conta bancária do e-commerce verificada no Stripe
  - [ ] Ativar PIX nas configurações do Stripe
  - [ ] Ativar Boleto nas configurações do Stripe
  - [ ] Completar verificação de identidade do negócio
- [ ] Adicionar opção de pagar com PIX no checkout
- [ ] Mostrar QR Code e código para copiar
- [ ] Adicionar opção de pagar com Boleto no checkout
- [ ] Gerar PDF do boleto para download
- [ ] Confirmar pagamento automaticamente quando PIX for pago
- [ ] Confirmar pagamento automaticamente quando Boleto for pago
- [ ] Definir prazo de expiração do PIX (sugestão: 24h)
- [ ] Definir prazo de expiração do Boleto (sugestão: 3 dias)
- [ ] Testar compra completa com PIX
- [ ] Testar compra completa com Boleto

#### Parcelamento e Cartão de Débito (~4-6h)
- [ ] Adicionar seleção de parcelas no checkout (1x até 12x)
- [ ] Mostrar valor de cada parcela
- [ ] Definir se haverá juros (e quem paga)
- [ ] Adicionar opção de cartão de débito
- [ ] Testar compra parcelada
- [ ] Testar compra com débito

#### Filtros de Produtos (~4-6h)
- [ ] Adicionar filtro por categoria de produto
- [ ] Adicionar filtro por faixa de preço
- [ ] Adicionar busca por nome do produto
- [ ] Mostrar quantos produtos foram encontrados
- [ ] Botão para limpar todos os filtros

---

### 🚫 CORREÇÕES URGENTES (~6-8h)

- [ ] Corrigir emails indo para endereço de teste (devem ir para o cliente real)
- [ ] Verificar se o pedido pertence ao cliente antes de mostrar
- [ ] Verificar estoque quando adicionar produto ao carrinho
- [ ] Verificar estoque novamente antes de finalizar pagamento
- [ ] Mostrar mensagem clara quando não houver estoque
- [ ] Descontar estoque automaticamente após pagamento confirmado
- [ ] Conectar painel admin com dados reais (atualmente usa dados de teste)

---

### ⚖️ LGPD - OBRIGATÓRIO POR LEI (~5h)

- [ ] Criar página de Política de Privacidade
- [ ] Criar página de Termos de Uso
- [ ] Adicionar checkbox "Li e aceito os Termos" no cadastro
- [ ] Impedir cadastro sem aceitar os termos
- [ ] Adicionar link "Solicitar exclusão de conta" (abre WhatsApp/email)
- [ ] Adicionar links das políticas no rodapé do site

---

### 📦 OPERAÇÃO DO DIA A DIA (~10-12h)

- [ ] Permitir mudar status do pedido (Pendente, Processando, Enviado, Entregue, Cancelado)
- [ ] Adicionar campo para código de rastreamento
- [ ] Enviar email automático quando pedido for enviado (com código de rastreio)
- [ ] Permitir editar preços dos produtos
- [ ] Permitir trocar imagens dos produtos
- [ ] **Gestão de Receitas Médicas:**
  - [ ] Visualizar receita enviada pelo cliente
  - [ ] Fazer upload de nova receita (quando cliente enviar correção)
  - [ ] Manter histórico de receitas

---

### 📱 SITE MOBILE E INDEXAÇÃO NO GOOGLE (~6-8h)

- [ ] Testar site no celular (catálogo, produto, checkout)
- [ ] Corrigir problemas de visualização no celular
- [ ] Testar formulários no celular
- [ ] Testar compra completa no celular
- [ ] Otimizar carregamento de imagens
- [ ] Verificar velocidade do site
- [ ] Adicionar títulos e descrições para o Google encontrar
- [ ] Criar arquivo para o Google indexar o site
- [ ] Garantir que produtos tenham URLs amigáveis
- [ ] Adicionar descrição nas imagens (para acessibilidade)

---

## Resumo de Horas

| O que será feito | Mínimo | Máximo |
|-----------|--------|--------|
| Sistema de Afiliados | 10h | 14h |
| PIX e Boleto | 12h | 20h |
| Parcelamento + Débito | 4h | 6h |
| Filtros de Produtos | 4h | 6h |
| Correções Urgentes | 6h | 8h |
| LGPD (obrigatório por lei) | 5h | 5h |
| Operação do Dia a Dia | 10h | 12h |
| Site Mobile + Google | 6h | 8h |
| **TOTAL** | **57h** | **79h** |

**Cronograma com 8h/semana:**
- Semana 1-2: Sistema de Afiliados
- Semana 3-4: PIX e Boleto
- Semana 5: Parcelamento + Débito + Filtros
- Semana 6: Correções Urgentes + LGPD
- Semana 7-8: Operação do Dia a Dia
- Semana 9: Site Mobile + Google
- Semana 10: Testes finais e ajustes

⚠️ **ATENÇÃO:** 64h disponíveis para 57-79h de trabalho.
- **Melhor cenário:** Sobram 7h ✅
- **Pior cenário:** Faltam 15h (atraso de ~2 semanas)

**Recomendação:** Trabalhar ~10h/semana para ter margem de segurança.

---

## Como Funcionará o Gerenciamento do E-commerce

### Fluxo de Pedidos

1. **Cliente faz pedido** → Status: "Pendente"
2. **Pagamento confirmado** → Status: "Processando" (estoque descontado automaticamente)
3. **Validação da receita** (se o produto precisar):
   - Funcionário visualiza receita no painel
   - Se OK → Continua para separação
   - Se problema → Contata cliente via WhatsApp/email pedindo nova receita
   - Cliente envia nova receita → Funcionário atualiza no sistema
4. **Separação do pedido**:
   - Imprime pedido com lista de produtos
   - Separa armação + lentes
   - Confere se está tudo certo
5. **Empacotamento**:
   - Embala com proteção
   - Coloca nota fiscal dentro
   - Fecha pacote com etiqueta
6. **Envio**:
   - Coloca código de rastreamento no sistema
   - Muda status para "Enviado" (cliente recebe email automático)
   - Leva aos Correios/transportadora
7. **Entrega concluída** → Muda status para "Entregue"

### Gestão de Afiliados (Médicos/Parceiros)

1. **Cadastrar afiliado** no painel (nome, contato, dados bancários)
2. **Criar cupom** vinculado ao afiliado (ex: "DRMARIA10" → 10% desconto)
3. **Cliente usa cupom** → Sistema registra qual afiliado indicou
4. **Fim do mês** → Ver relatório de vendas por afiliado
5. **Fazer repasse** → Transferir valor via PIX/TED (fora do sistema)
6. **Marcar como pago** → Checkbox no sistema para controle

**Incluído nesta entrega:**
- Cadastro completo de afiliados
- Cadastro completo de cupons
- Vincular cupom a afiliado
- Relatório de vendas por afiliado

### Formas de Pagamento

- **Cartão de Crédito:** Confirmação na hora (à vista ou parcelado até 12x)
- **Cartão de Débito:** Confirmação na hora
- **PIX:** Mostra QR Code, confirmação em até 30 minutos
- **Boleto:** Gera PDF, confirmação em 1-3 dias úteis

**Sobre Parcelamento:**
- Cliente escolhe quantas parcelas (1x a 12x)
- Definir com vocês: terá juros ou não?
- Se tiver juros: quem paga (loja ou cliente)?

**Para PIX e Boleto funcionarem:**
- CNPJ do e-commerce ativo no Stripe
- Conta bancária do e-commerce verificada
- Ativar PIX e Boleto nas configurações
- Completar verificação da empresa

### Controle de Estoque

- **Ao adicionar ao carrinho:** Sistema verifica se tem estoque
- **Antes de pagar:** Sistema verifica novamente
- **Após pagamento:** Desconta automaticamente do estoque
- **Reposição:** Funcionário atualiza manualmente no painel
- **Sem estoque:** Sistema bloqueia a compra e mostra mensagem

### Receitas Médicas

- **Cliente envia:** Foto ou PDF da receita no checkout
- **Sistema aceita:** Qualquer arquivo (validação automática)
- **Funcionário confere:** Visualiza receita no painel após pagamento
- **Se tiver problema:**
  1. Funcionário contata cliente via WhatsApp/email
  2. Explica o problema com a receita
  3. Cliente envia receita nova
  4. Funcionário faz upload da nova receita no sistema
- **Histórico:** Sistema guarda todas as receitas

### Atendimento ao Cliente

- **Principal canal:** WhatsApp (botão no site)
- **Reembolsos:** Cliente pede via WhatsApp, processado manualmente
- **Trocas:** 7 dias por lei (CDC), processado manualmente
- **Dúvidas:** Respondidas via WhatsApp/email

### Nota Fiscal

- **Emissão:** Manual em sistema de NF (a definir)
- **Quando:** Após pagamento confirmado
- **Envio:** PDF por email ou WhatsApp

**⚠️ IMPORTANTE:** Como o e-commerce tem CNPJ diferente da ótica física, provavelmente NÃO dá para usar o mesmo sistema de NF. Opções:
1. Contratar sistema de NF específico para o e-commerce
2. Usar serviço online (Nota Fiscal Fácil, NFe.io, etc.)
3. Consultar contador sobre melhor opção

### Frete

- **Cálculo:** Valor fixo por região (definir tabela com vocês)
- **Etiquetas:** Geradas manualmente no site dos Correios/transportadora
- **Rastreamento:** Código inserido manualmente no painel
- **Entrega:** Responsabilidade dos Correios/transportadora

---

## O que foi Simplificado para Caber no Prazo

### ✅ Decisões tomadas

1. **Prova Virtual com IA** → Adiada para depois do lançamento
   - *Motivo:* Levaria 80-120h, não cabe no prazo

2. **Dashboard de Métricas** → Usar o dashboard do Stripe
   - *Motivo:* Stripe já mostra relatórios de vendas

3. **Aprovação de Receitas no Sistema** → Validação manual via WhatsApp
   - *Motivo:* Mais simples e funciona igual

4. **Cálculo Automático de Frete** → Frete fixo por região
   - *Motivo:* Integração com transportadora levaria +8-12h

5. **Reembolsos Automáticos** → Processamento manual via WhatsApp
   - *Motivo:* Volume baixo não justifica automação

6. **Nota Fiscal Integrada** → Emissão manual
   - *Motivo:* Integração é muito complexa (~20-30h)

7. **Exclusão de Conta** → Cliente solicita via WhatsApp
   - *Motivo:* Implementação completa levaria +4-6h

8. **Sincronização de Estoque** → Atualização manual
   - *Motivo:* Não sabemos qual sistema a loja física usa

### 🎯 O que o e-commerce terá no lançamento

- Catálogo de produtos com filtros
- Carrinho e finalização de compra
- 4 formas de pagamento (Cartão Crédito/Débito, PIX, Boleto)
- Parcelamento em até 12x
- Sistema de afiliados para rastrear indicações
- Gestão de pedidos
- Conformidade com a lei (LGPD)
- Botão de WhatsApp para contato

**Filosofia:** Lançar funcionando, melhorar depois. Melhor ter um e-commerce simples vendendo do que um complexo nunca lançado.

---

## Próximos Passos (Ação Necessária)

### 🔴 DECISÕES URGENTES

**1. Adiar Prova Virtual para depois do lançamento?**
- [ ] Sim, lançar sem Prova Virtual em Janeiro e entregar depois
- [ ] Não, esperar até a Prova Virtual estar pronta (atrasa para ~Abril 2026)

**2. Como farão as entregas?**
- [ ] Correios (PAC/SEDEX) - vocês levam à agência
- [ ] Transportadora com coleta (ex: Jadlog, Total Express)
- [ ] Apenas entrega local/retirada na loja
- [ ] Outro: _______________

**3. Qual o prazo de produção das lentes com grau?**
- [ ] 3-5 dias úteis
- [ ] 7-10 dias úteis
- [ ] 10-15 dias úteis
- [ ] Depende do laboratório parceiro

**4. Qual a política de trocas e devoluções?**
- [ ] Seguir a lei (7 dias para arrependimento)
- [ ] 30 dias para troca
- [ ] 7 dias para armação, sem devolução para lentes personalizadas
- [ ] Outro: _______________

**5. Terão frete grátis?**
- [ ] Sim, para compras acima de R$ ____
- [ ] Sim, para a região de _____________
- [ ] Não, cliente sempre paga frete
- [ ] Ainda não definido

**6. Parcelamento terá juros?**
- [ ] Não, sem juros (loja absorve taxa do Stripe)
- [ ] Sim, com juros (cliente paga)
- [ ] Sem juros até 3x, com juros a partir de 4x
- [ ] Outro: _______________

**7. Até quantas parcelas aceitar?**
- [ ] Até 3x
- [ ] Até 6x
- [ ] Até 10x
- [ ] Até 12x

**8. Quem vai responder os clientes online?**
- [ ] Mesmo time da loja física
- [ ] Pessoa dedicada ao e-commerce
- [ ] WhatsApp específico (número: _____________)
- [ ] Email específico (_____________@_____________)

---

### 📋 PROVIDÊNCIAS DO CLIENTE

**9. Textos legais prontos?**
- [ ] Enviar texto da Política de Privacidade
- [ ] Enviar texto dos Termos de Uso
- [ ] (Recomendação: consultar advogado ou usar templates prontos)

**⚠️ IMPORTANTE:** Estes são documentos legais que vinculam o negócio de vocês. Recomendo fortemente que revisem com um advogado. Se preferirem, posso fornecer um template básico como ponto de partida, mas vocês precisam adaptar às práticas de vocês e validar juridicamente.

**10. Sistema de Nota Fiscal definido?**
- [ ] Vamos usar o mesmo sistema da ótica (verificar se aceita outro CNPJ)
- [ ] Contratar sistema específico (NFe.io, Nota Fiscal Fácil, etc.)
- [ ] Consultar contador

**11. Tabela de frete por região?**
Preencher valores:
- [ ] Sul: R$ ____
- [ ] Sudeste: R$ ____
- [ ] Centro-Oeste: R$ ____
- [ ] Nordeste: R$ ____
- [ ] Norte: R$ ____
- [ ] Ou frete único nacional: R$ ____

**12. Lista inicial de afiliados?**
- [ ] Nome do afiliado 1: _____________
- [ ] Cupom: _____________ | Desconto: ____% | Comissão: ____%
- [ ] Nome do afiliado 2: _____________
- [ ] Cupom: _____________ | Desconto: ____% | Comissão: ____%
- [ ] (adicionar mais conforme necessário)

---

## Para Depois do Lançamento (Fase 2) - INCLUSO NO CONTRATO

**⚠️ Estas funcionalidades estão no contrato original e devem ser entregues:**

- Prova Virtual com IA (experimentar óculos no rosto)
- Medição facial automática das medidas oculares
- Renderização 3D dos óculos no rosto do cliente

**Estimativa:** 80-120 horas de trabalho adicional

---

> **Última atualização:** 15 de Novembro de 2025
