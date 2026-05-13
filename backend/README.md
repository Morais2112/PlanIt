# PlanIt Backend

Backend Express simples com autenticação JWT e armazenamento em arquivo JSON
(`planit-db.json`, gerado em runtime).

## Como rodar

```
cd backend
npm install
npm start
```

O servidor sobe em http://localhost:3001

## Endpoints

- `POST /api/register` — `{ email, senha, nome? }` → cria conta + retorna `{ token, user }`
- `POST /api/login` — `{ email, senha }` → retorna `{ token, user }`
- `GET  /api/me` — header `Authorization: Bearer <token>` → `{ user }`
- `GET  /api/viagens` — auth → array de viagens do usuário
- `PUT  /api/viagens` — auth + body = array → substitui as viagens

## Segredo JWT

Em produção, defina `JWT_SECRET` no ambiente.
Em dev, usa um valor fixo (`planit-dev-secret-change-me`).
