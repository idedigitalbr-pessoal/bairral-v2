# Grupo Bairral — Canal de Denúncias e Integridade

Sistema completo, robusto e em conformidade com a Lei Anticorrupção (Lei nº 12.846/2013), Lei 14.457/2022 e LGPD (Lei nº 13.709/2018) para registro, acompanhamento, apuração e governança de manifestações e denúncias do Grupo Bairral de Psiquiatria.

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion, Recharts
- **Backend API**: NestJS, TypeScript, Prisma ORM, Express, Swagger / OpenAPI
- **Banco de Dados**: MySQL / PostgreSQL (via Prisma Schema)
- **Segurança & Criptografia**: JWT, bcryptjs, Criptografia AES de dados de identificação, Proteção contra Path Traversal, Rate Limiting, Logs de Auditoria Imutáveis

## 📁 Estrutura da Documentação

- [`docs/architecture.md`](./docs/architecture.md): Arquitetura geral do sistema e fluxos end-to-end com diagramas Mermaid.
- [`docs/system-design.md`](./docs/system-design.md): Detalhamento dos módulos, serviços e padrão de camadas.
- [`docs/security.md`](./docs/security.md): Políticas de segurança, criptografia, RBAC, auditoria e LGPD.
- [`docs/data-model.md`](./docs/data-model.md): Modelo de dados (Prisma Schema, Relacionamentos e Dicionário de Dados).
- [`docs/api.md`](./docs/api.md): Especificação dos endpoints RESTful da API e Swagger.
- [`docs/deployment.md`](./docs/deployment.md): Guia de implantação, variáveis de ambiente, Docker e Cloud Run.
- [`docs/privacy.md`](./docs/privacy.md): Políticas de privacidade, anonimato, sigilo e tratamento de dados (LGPD).
- [`docs/design-system.md`](./docs/design-system.md): Identidade visual do Grupo Bairral e guia de componentes.

## ⚙️ Execução

### Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure suas variáveis:
```bash
cp .env.example .env
```

### Comandos Principais
```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Executar linter
npm run lint

# Compilar aplicação
npm run build
```

## 📜 Licença e Propriedade
Desenvolvido com exclusividade para o **Grupo Bairral de Psiquiatria**. Todos os direitos reservados.
