# ✈️ PlanIt

Planejador de viagens completo: monte roteiros dia a dia, controle gastos em 14 moedas diferentes, visualize seus passeios no mapa e leve tudo offline na hora que o roaming acabar.

<p align="left">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express 4">
  <img src="https://img.shields.io/badge/JWT-auth-FB015B?logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

---

## 📸 Demonstração

> **Nota:** substitua as imagens abaixo pelas suas capturas. Veja [como gerar](#-gerando-as-capturas) no fim do README.

| Dashboard | Roteiro por dia |
|:---:|:---:|
| ![Dashboard](docs/dashboard.png) | ![Roteiro](docs/roteiro.png) |

| Mapa dos passeios | Modo escuro |
|:---:|:---:|
| ![Mapa](docs/mapa.png) | ![Dark mode](docs/dark.png) |

<p align="center">
  <img src="docs/demo.gif" alt="PlanIt em uso" width="720">
</p>

---

## 📋 Funcionalidades

**Planejamento**

- Catálogo curado com **40 destinos** (15 capitais e cidades brasileiras + 25 internacionais) e **mais de 230 pontos turísticos** com valores estimados na moeda local
- Roteiro organizado **dia a dia**, com horário por passeio e reordenação via **drag and drop**
- Notas livres por dia (reserva de restaurante, lembrete de ingresso, o que for)
- Hospedagem com **autocomplete de endereço** — digite "Ouro Minas BH" e o hotel aparece no mapa
- Registro de voos (ida, volta, conexões) e checklist de bagagem com templates prontos (Básico, Praia, Frio, Internacional)

**Custos**

- Valores em **14 moedas** com cotação em tempo real e conversão bidirecional
- Cálculo automático por pessoa e total da viagem
- Orçamento opcional com acompanhamento do quanto já foi comprometido

**Visualização**

- **Mapa interativo** com marcadores numerados na ordem do roteiro, coloridos por categoria
- Contagem regressiva até a data de embarque
- **Modo escuro** em toda a aplicação
- Exportar roteiro em **PDF** pronto para imprimir

**Dados e conta**

- Autenticação real com JWT e senhas protegidas com bcrypt
- Rotas protegidas e sincronização automática com o servidor
- Funciona **offline** — os dados ficam no dispositivo e sincronizam quando a conexão volta
- Backup e restauração completos em JSON

---

## 🛠 Stack

**Frontend** — React 19, Vite 8, Tailwind CSS 4, React Router 7
**Backend** — Node.js, Express, JWT, bcryptjs
**APIs externas** — [Nominatim/OpenStreetMap](https://nominatim.org/) (geocoding), [AwesomeAPI](https://docs.awesomeapi.com.br/) (câmbio), [Leaflet](https://leafletjs.com/) (mapas)

---

## 🧠 Decisões técnicas

Algumas escolhas de implementação que valem explicação:

### Leaflet carregado sob demanda, sem entrar no bundle

O mapa aparece em uma única tela. Adicionar `leaflet` + `react-leaflet` como dependência penalizaria o carregamento inicial de todos os usuários, inclusive os que nunca abrem essa tela.

`MapaBlock.jsx` injeta o CSS e o JS do Leaflet no DOM apenas quando o componente monta, com deduplicação (verifica se a tag já existe) e uma promise em cache, para que múltiplas montagens não disparem downloads repetidos.

**Trade-off assumido:** o mapa passa a depender de um CDN externo. Aceitável porque o restante da aplicação funciona normalmente se ele falhar — o mapa degrada, o roteiro não.

### Geocoding com cache e rate limiting

O Nominatim é gratuito, mas a política de uso pede no máximo 1 requisição por segundo. Sem controle, uma viagem com 8 passeios dispararia 8 requisições simultâneas no primeiro render e seria bloqueada.

A solução foi uma fila com espaçamento entre chamadas e cache em memória indexado pela query. Re-renders não geram requisições novas, e o autocomplete de hospedagem usa debounce de 350ms com `viewbox` limitado às coordenadas da cidade de destino — menos requisições e resultados mais relevantes.

### Offline-first, porque é o caso de uso real

Planejar viagem é justamente a situação em que você está sem internet boa: avião, aeroporto, exterior sem roaming.

O `localStorage` é a fonte de verdade imediata: toda edição aparece na tela na hora, sem esperar rede. A sincronização com o backend é debounced em 600ms. Se o servidor cair ou não houver conexão, o aplicativo continua inteiramente funcional e reconcilia depois.

### Câmbio com fallback em camadas

A conversão de moedas tenta, nesta ordem:

1. AwesomeAPI (cotação do dia)
2. Cache em `sessionStorage` com validade de 1 hora
3. Valores embutidos no código

Três camadas porque uma cotação ligeiramente desatualizada é muito melhor que uma tela quebrada. O usuário quer saber se o passeio custa "mais ou menos R$ 200" — não precisa da quarta casa decimal.

### Conversão bidirecional usando BRL como pivô

Com 14 moedas, manter todos os pares exigiria 182 taxas. Convertendo sempre através do real (`origem → BRL → destino`), são apenas 13 taxas para buscar e manter.

O custo é um arredondamento a mais por conversão, irrelevante nessa ordem de grandeza.

### PDF sem biblioteca de PDF

Exportar o roteiro usa `@media print` no CSS e `window.print()`, em vez de jsPDF ou similar (~300 KB no bundle). O navegador já sabe gerar PDF; bastava dizer a ele o que esconder e como quebrar as páginas.

### Prevenção do flash de tema

Um script no `main.jsx` lê a preferência salva e aplica a classe `dark` no `<html>` **antes** do React montar. Sem isso, todo carregamento no modo escuro pisca branco por alguns frames.

### Segurança do backend

O backend é pequeno, mas expõe autenticação — e isso traz um conjunto de responsabilidades que não dá para adiar:

**O servidor se recusa a subir em produção sem `JWT_SECRET`.** Existe um valor padrão para desenvolvimento, e ele está publicado neste repositório. Se esse valor chegasse a um ambiente real, qualquer pessoa que lesse o código poderia assinar um token válido para qualquer conta. Quando `NODE_ENV=production` e a variável não está definida, o processo sai com erro em vez de subir inseguro.

**CORS restrito por lista de origens.** `cors()` sem argumento libera qualquer site a chamar a API com as credenciais do usuário. As origens permitidas agora vêm de `CORS_ORIGIN`. Requisições sem header `Origin` continuam passando — são `curl`, health check do provedor, aplicativo nativo; não há sessão de outro site em risco nesses casos.

**Rate limiting em login e cadastro.** Adivinhar senha é o ataque mais barato contra este servidor. São 10 tentativas de login a cada 15 minutos e 5 cadastros por hora, por IP. A implementação é um `Map` em memória, coerente com a arquitetura de instância única — o "banco" é um arquivo no disco local, então rodar réplicas já não funcionaria hoje. Se o backend escalar horizontalmente, esse contador precisa migrar para um Redis: com N réplicas, cada uma conta separado e o limite efetivo vira N vezes o configurado.

**Resposta idêntica para email inexistente e senha errada.** Mensagens diferentes transformariam a tela de login em um verificador de cadastro — dá para descobrir quais emails têm conta aqui sem acertar nenhuma senha.

**Validação de payload no `PUT /api/viagens`.** A rota aceitava qualquer corpo de até 5 MB e gravava direto no banco. Agora há teto de viagens por conta, de itens por lista e de tamanho do corpo. A checagem é estrutural — ids, tipos e limites — e não um schema campo a campo de propósito: o import de backup precisa aceitar arquivos gerados por versões anteriores, e um schema rígido rejeitaria dados legítimos a cada campo novo.

**Trade-off assumido:** persistência em arquivo JSON não suporta escrita concorrente — duas requisições simultâneas do mesmo usuário podem sobrescrever uma à outra. Na prática não aparece, porque o cliente sincroniza com debounce e cada conta escreve sozinha. É o primeiro item a mudar se o projeto sair do uso pessoal.

---

## 💻 Como rodar

Pré-requisitos: Node.js 18 ou superior.

```bash
git clone https://github.com/seu-usuario/planit.git
cd planit
```

### Backend

```bash
cd backend
npm install
cp .env.example .env    # ajuste o JWT_SECRET
npm run dev             # http://localhost:3001
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

Crie sua conta na tela de cadastro e comece a planejar.

### Variáveis de ambiente

| Arquivo | Variável | Padrão | Obrigatória |
|---|---|---|---|
| `backend/.env`  | `JWT_SECRET`    | chave de dev | **Sim em produção** — o servidor não sobe sem ela |
| `backend/.env`  | `PORT`          | `3001` | Não |
| `backend/.env`  | `CORS_ORIGIN`   | `localhost:5173,localhost:4173` | Em produção, sim |
| `frontend/.env` | `VITE_API_URL`  | `http://localhost:3001/api` | Só se a API não for local |

> Variáveis `VITE_*` são embutidas no bundle durante o build e ficam visíveis
> para quem abrir o site. Nada de segredo nelas — chaves e tokens ficam no backend.

---

## 🔌 API

Todas as rotas abaixo de `/api/me` exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição | Limite |
|---|---|---|---|
| `GET`  | `/api/health`   | Verificação de disponibilidade | — |
| `POST` | `/api/register` | Cria conta → `{ token, user }` | 5 / hora |
| `POST` | `/api/login`    | Autentica → `{ token, user }` | 10 / 15 min |
| `GET`  | `/api/me`       | Dados do usuário autenticado | — |
| `GET`  | `/api/viagens`  | Lista as viagens do usuário | — |
| `PUT`  | `/api/viagens`  | Substitui as viagens do usuário | corpo até 2 MB |

Erros seguem o formato `{ "erro": "mensagem" }`. Os códigos usados são `400`
(dados inválidos), `401` (token ausente, inválido ou credenciais incorretas),
`409` (email já cadastrado), `413` (corpo grande demais) e `429` (limite de
tentativas atingido — acompanha o header `Retry-After`).

---

## 📁 Estrutura

```text
planit/
├── backend/
│   ├── server.js              # API Express: auth JWT + persistência das viagens
│   └── planit-db.json         # Banco em arquivo (fora do versionamento)
└── frontend/src/
    ├── components/
    │   ├── MapaBlock.jsx          # Mapa Leaflet + geocoding com cache
    │   ├── HospedagemBlock.jsx    # Hospedagem com autocomplete de endereço
    │   ├── VoosBlock.jsx          # Registro de voos
    │   ├── ChecklistBlock.jsx     # Checklist de bagagem
    │   └── CampoSenha.jsx         # Input de senha com alternância de visibilidade
    ├── contexts/AuthContext.jsx   # Sessão e token
    ├── data/destinos.js           # Catálogo, moedas e utilitários de conversão
    ├── hooks/
    │   ├── useViagens.js          # CRUD das viagens + sincronização
    │   ├── useCotacoes.js         # Câmbio com cache e fallback
    │   └── useTheme.js            # Tema claro/escuro
    ├── lib/api.js                 # Cliente HTTP
    └── pages/                     # Login, Cadastro, Dashboard, DetalhesViagem
```

---

## 🗺 Próximos passos

- [ ] Testes automatizados com Vitest nas funções de conversão e cálculo de datas
- [ ] Integração contínua no GitHub Actions
- [ ] PWA para instalação no celular
- [ ] Previsão do tempo por dia de roteiro
- [ ] Compartilhamento de viagem em modo somente leitura

---

## 📷 Gerando as capturas

Para preencher a seção de demonstração:

1. Crie a pasta `docs/` na raiz do projeto.
2. Rode o projeto com uma viagem de exemplo bem preenchida — vários passeios distribuídos em dias, hospedagem com endereço e orçamento definido. Uma tela vazia não demonstra nada.
3. Capture com `Win + Shift + S` e salve como `dashboard.png`, `roteiro.png`, `mapa.png` e `dark.png`.
4. Para o GIF, grave a tela com [ScreenToGif](https://www.screentogif.com/) (gratuito) mostrando um fluxo curto: criar viagem → adicionar passeios → arrastar para reordenar → abrir o mapa. Entre 10 e 15 segundos é suficiente. Salve como `docs/demo.gif`.

---

## 📄 Licença

MIT
