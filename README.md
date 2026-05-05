# ✈️ PlanIt

Aplicação web para organizar e planejar viagens de forma simples e intuitiva. Monitore os seus destinos, crie roteiros diários e tenha o controle dos gastos da sua viagem num só lugar.

## 🚀 Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- **LocalStorage API** (para persistência de dados no navegador)

## 📋 Funcionalidades

- [x] Tela de Login e Cadastro
- [x] Dashboard com listagem e busca rápida de viagens
- [x] Criar, visualizar detalhes, editar e deletar viagens
- [x] Gerenciamento de passeios e pontos turísticos (com data, horário, categoria e valor)
- [x] Cálculo automático de custos estimados (por pessoa e total)
- [x] Salvar viagens localmente (via `localStorage`)

## 💻 Como rodar o projeto

1. Clone o repositório ou baixe o código.
2. Acesse a pasta raiz e instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

## 📁 Estrutura de pastas principal

```text
src/
├── components/       # Componentes modulares e reutilizáveis (ex: Modais)
│   ├── ConfirmModal.jsx
│   ├── NovaViagemModal.jsx
│   └── PontoTuristicoModal.jsx
├── data/             # Dados estáticos (ex: destinos, formatação BRL)
├── hooks/            # Hooks customizados (ex: useViagens para operações CRUD)
├── pages/            # Páginas principais da aplicação
│   ├── Cadastro.jsx
│   ├── Dashboard.jsx
│   ├── DetalhesViagem.jsx
│   └── Login.jsx
├── App.jsx           # Configuração das rotas
└── index.css         # Estilos globais (Tailwind CSS)
```

## 🛠️ Próximos Passos / Melhorias Futuras

- [ ] Integração com backend / banco de dados real
- [ ] Exportação de roteiros em PDF
- [ ] Compartilhamento de viagens com outros usuários
