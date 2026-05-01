# Chá de Casa Nova | Bia & Gustavo

Aplicação com duas experiências principais:

- `Lista de Presentes` com status, filtros, busca e painel administrativo local.
- `Rifa do PIX` com reserva de números, comprovante e acompanhamento em `localStorage`.

O frontend foi migrado para React com Vite. O backend FastAPI continua disponível para servir a build final em `/static` e manter a base do projeto Python já existente.

## Estrutura

```text
casa-nova/
├── backend/         # FastAPI + SQLite
├── frontend/        # React + Vite
├── main.py          # entrada do FastAPI
└── requirements.txt
```

## Como rodar o frontend em desenvolvimento

```bash
cd /home/gustavo/Documentos/Lista-de-Casa/casa-nova/frontend
npm install
cp .env.example .env
npm run dev
```

Depois abra o endereço exibido pelo Vite, normalmente `http://127.0.0.1:5173`.

## Como gerar a build e servir pelo FastAPI

1. Gere a build do frontend:

```bash
cd /home/gustavo/Documentos/Lista-de-Casa/casa-nova/frontend
npm install
cp .env.example .env
npm run build
```

2. Suba o backend:

```bash
cd /home/gustavo/Documentos/Lista-de-Casa/casa-nova
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

3. Abra:

```text
http://127.0.0.1:8000
```

## Variáveis de ambiente do frontend

Crie `frontend/.env` a partir de `frontend/.env.example`.

```bash
VITE_GEMINI_API_KEY=
VITE_ADMIN_PIN=3105
```

Observação: como o PIN fica no frontend, ele não é seguro para cenários reais de produção. Hoje ele funciona apenas como um bloqueio visual local.
