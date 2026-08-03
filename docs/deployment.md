# Guia de Implantação e Deploy — Grupo Bairral

Instruções para compilar, empacotar e publicar a aplicação em ambiente de produção (Cloud Run / Docker / On-Premise).

---

## 1. Requisitos de Ambiente

- **Node.js**: v18.x ou v20.x LTS
- **Banco de Dados**: MySQL 8.0+ ou PostgreSQL 14+
- **Memória Mínima**: 1 GB RAM
- **Armazenamento**: Disco com permissão de escrita para o diretório `./uploads`

---

## 2. Variáveis de Ambiente Necessárias

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Modo de execução | `production` |
| `PORT` | Porta do servidor HTTP | `3000` |
| `DATABASE_URL` | String de conexão Prisma MySQL/PostgreSQL | `mysql://user:pass@localhost:3306/bairral_db` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | `secret-hash-super-segura` |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT | `8h` |
| `CRYPTO_SECRET_KEY` | Chave AES de 32 caracteres para dados LGPD | `12345678901234567890123456789012` |
| `CORS_ORIGIN` | Domínio autorizado para CORS | `https://denuncias.bairral.com.br` |
| `VITE_ENABLE_MOCKS` | Alternar mocks frontend vs API real | `false` |

---

## 3. Passos de Deploy

### Passo 1: Instalação e Compilação
```bash
# 1. Instalar dependências de produção
npm install --production=false

# 2. Gerar Prisma Client
npx prisma generate

# 3. Executar o build estático do frontend e servidor express/nestjs
npm run build
```

### Passo 2: Migração do Banco de Dados
```bash
npx prisma db push
```

### Passo 3: Inicialização do Servidor de Produção
```bash
npm start
```
O script `start` iniciará a aplicação escutando na porta 3000 (atrás do Nginx reverse proxy).
