# 🖥️ PC Builder - Montador de PC Inteligente

Um aplicativo web interativo e inteligente projetado para auxiliar usuários na simulação de montagem de computadores desktop. O sistema não apenas lista componentes, mas atua como um validador de hardware em tempo real, impedindo montagens incompatíveis que causariam falhas físicas ou elétricas no mundo real.

🔗 **Link do Projeto (Vercel):** [https://pc-builder-react.vercel.app/]

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas do ecossistema moderno do desenvolvimento Web:

- **[React (Vite)](https://react.dev/):** Biblioteca principal para a construção da interface reativa e componentizada.
- **[TypeScript](https://www.typescriptlang.org/):** Adicionado para trazer tipagem estática segura, reduzindo erros em tempo de desenvolvimento.
- **[Zustand](https://zustand-demo.pmnd.rs/):** Gerenciador de estado global robusto e ultra-leve, utilizado como o "Sistema ME" do projeto para centralizar o carrinho de compras.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework utilitário para estilização rápida, moderna e totalmente responsiva com tema escuro (*dark mode*).
- **[React Toastify](https://fkhadra.github.io/react-toastify/introduction/):** Biblioteca para notificações flutuantes (*Toasts*) personalizadas, aprimorando a experiência do usuário (UX).
- **[Supabase](https://supabase.com/):** Plataforma de banco de dados em nuvem que serve como nosso Backend-as-a-Service (BaaS).

---

## 🗄️ Arquitetura do Banco de Dados: PostgreSQL & Supabase

O coração dos dados da aplicação reside em um banco de dados relacional **PostgreSQL**, hospedado e gerenciado através do **Supabase**. A escolha do PostgreSQL permitiu o armazenamento estruturado com tipos de dados avançados (como `UUID` para chaves primárias seguras) e alta consistência transacional.

Abaixo está a estrutura das tabelas criadas no banco:

### 1. Tabela `componentes`
Armazena todo o estoque de peças disponíveis na loja, contendo especificações técnicas fundamentais para as regras de validação.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Identificador único universal da peça. |
| `nome` | `TEXT` | Nome comercial completo do componente. |
| `categoria` | `TEXT` | Categoria do item (`CPU`, `GPU`, `PLACA_MAE`, `RAM`, `FONTE`, `ARMAZENAMENTO`). |
| `preco` | `NUMERIC` | Preço em Reais (R$). |
| `soquete` | `TEXT` (Nullable) | Tipo de soquete (ex: `AM4`, `AM5`, `LGA1700`). *Apenas para CPU e Placa-Mãe.* |
| `consumo_watts`| `INT8` | Consumo elétrico estimado da peça sob carga. |
| `tipo_ram` | `TEXT` (Nullable) | Geração de memória suportada (`DDR4`, `DDR5`). *Apenas para RAM e Placa-Mãe.* |
| `potencia_fonte`| `INT8` (Nullable) | Potência máxima de entrega de energia. *Apenas para a categoria FONTE.* |

### 2. Tabela `setups_salvos`
Responsável por persistir os computadores montados e finalizados pelos usuários na plataforma (operação de `INSERT`).

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Identificador do setup gerado via `gen_random_uuid()`. |
| `created_at` | `TIMESTAMP` | Data e hora automática do salvamento (`NOW()`). |
| `cpu_id` | `UUID` | ID estrangeiro apontando para a CPU escolhida. |
| `placa_mae_id` | `UUID` | ID estrangeiro apontando para a Placa-Mãe escolhida. |
| `ram_id` | `UUID` (Nullable)| ID estrangeiro apontando para a Memória RAM escolhida. |
| `gpu_id` | `UUID` (Nullable)| ID estrangeiro apontando para a Placa de Vídeo escolhida. |
| `armazenamento_id`| `UUID` (Nullable)| ID estrangeiro apontando para o SSD/HD escolhido. |
| `fonte_id` | `UUID` (Nullable)| ID estrangeiro apontando para a Fonte de Alimentação. |
| `preco_total` | `NUMERIC` | Valor final do computador somado pelo sistema. |

---

## 🛡️ Regras de Negócio e Validações Inteligentes (Mão Dupla)

Para garantir uma simulação realista e à prova de falhas, o aplicativo possui uma camada complexa de validações sob o padrão *Early Return*, protegendo o fluxo contra dados nulos (`null` pointer errors):

1. **Compatibilidade de Processador (Soquete):**
   - **Mão Dupla:** Se o usuário escolher uma Placa-Mãe primeiro, o sistema bloqueia CPUs de soquetes diferentes. Se escolher a CPU primeiro, o sistema bloqueia Placas-Mãe com encaixes diferentes.
2. **Compatibilidade de Memória RAM (Geração DDR):**
   - **Mão Dupla:** Impede o cruzamento de memórias `DDR4` em placas `DDR5` e vice-versa, validando de forma independente tanto na seleção do pente de RAM quanto na seleção da Placa-Mãe.
3. **Cálculo de Carga Elétrica (Segurança da Fonte):**
   - O sistema calcula de forma dinâmica o **Estado Derivado** do consumo de energia (soma de todos os Watts do setup). Se o usuário tentar adicionar uma Fonte cuja `potencia_fonte` seja inferior ao gasto atual acumulado, o sistema barra o componente e notifica o perigo elétrico.
4. **Mutação Visual de Estado (Feedback de UX):**
   - O aplicativo monitora os IDs das peças inseridas no estado global. Caso uma peça já pertença ao carrinho, o botão de seleção sofre uma mutação reativa: muda o texto para *"Adicionado"*, altera sua cor para cinza fosco e desabilita o clique (`disabled`), impedindo duplicidade acidental.
