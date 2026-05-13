# ✈️ PlanIt

Aplicação web para organizar e planejar viagens de forma simples e intuitiva. Monitore os seus destinos, crie roteiros diários e tenha o controle dos gastos da sua viagem num só lugar.

## 🚀 Tecnologias

**Frontend:**
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- Autenticação com [JWT (JSON Web Tokens)](https://jwt.io/) e [bcryptjs](https://www.npmjs.com/package/bcryptjs)

## 📋 Funcionalidades

- [x] Tela de Login e Cadastro com autenticação
- [x] Rotas protegidas (acesso exclusivo para usuários logados)
- [x] Dashboard com listagem e busca rápida de viagens
- [x] Criar, visualizar detalhes, editar e deletar viagens
- [x] Gerenciamento de passeios e pontos turísticos (com data, horário, categoria e valor)
- [x] Cálculo automático de custos estimados (por pessoa e total)

## 💻 Como rodar o projeto

1. Clone o repositório ou baixe o código.

### Iniciando o Backend

2. Acesse a pasta do backend e instale as dependências:
```bash
cd backend
npm install
```
3. Inicie o servidor:
```bash
npm run dev
```

### Iniciando o Frontend

4. Em um novo terminal, acesse a pasta do frontend e instale as dependências:
```bash
cd frontend
npm install
```
5. Inicie a aplicação React:
```bash
npm run dev
```
6. Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

## 📁 Estrutura de pastas principal

```text
PlanIt/
├── backend/                  # API e lógica de servidor
│   ├── server.js             # Ponto de entrada do servidor
│   └── package.json
└── frontend/                 # Interface de usuário (React)
    ├── src/
    │   ├── components/       # Componentes modulares (ex: Modais, RotaProtegida)
    │   ├── contexts/         # Contextos da aplicação (ex: AuthContext)
    │   ├── data/             # Dados estáticos e formatações
    │   ├── hooks/            # Hooks customizados
    │   ├── pages/            # Páginas principais (Cadastro, Dashboard, DetalhesViagem, Login)
    │   ├── App.jsx           # Configuração das rotas
    │   └── index.css         # Estilos globais (Tailwind CSS)
    └── package.json
```
