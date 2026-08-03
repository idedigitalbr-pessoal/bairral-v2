# System Design — Canal de Denúncias Grupo Bairral

Este documento apresenta a especificação técnica detalhada do design do sistema, padrão de módulos, gerenciamento de estado e integrações.

---

## 1. Princípios Arquiteturais

1. **Separação Rígida de Responsabilidades**:
   - O Frontend não possui dependência direta ou conhecimento de esquemas de banco de dados.
   - O Backend expõe contratos de API RESTful estritos documentados via Swagger.
2. **Privacidade e Proteção LGPD por Design**:
   - Identidade de manifestantes é mantida em tabela separada (`ReporterIdentity`) com criptografia AES-256 de via dupla.
   - Acesso a dados sigilosos exige permissão explícita (`VIEW_REPORTER_IDENTITY`).
3. **Auditoria Imutável**:
   - Toda alteração crítica gera um registro append-only na tabela `AuditLog`.

---

## 2. Estrutura de Módulos da API (NestJS)

```
apps/api/src/
├── common/             # Interceptors, Guards, Decorators e Providers Comuns (Storage, Crypto)
├── config/             # Configurações de Ambiente
├── database/           # Conexão e Prisma Client
├── modules/
│   ├── action-plans/   # Gestão de Planos de Ação e Evidências
│   ├── assignments/    # Atribuição de Relatores e Investigadores
│   ├── attachments/    # Upload e Download Seguro de Anexos
│   ├── audit/          # Registros Imutáveis de Governança e Auditoria
│   ├── auth/           # Login, JWT, Refresh Token e RBAC
│   ├── categories/     # Gestão de Tipos e Categorias com SLA
│   ├── dashboard/      # Indicadores, Métricas, KPIs e Gráficos
│   ├── departments/    # Departamentos vinculados às Unidades
│   ├── health/         # Endpoint de Health Check do Sistema
│   ├── messages/       # Mensagens Públicas e Comentários Internos Sigilosos
│   ├── notifications/  # Notificações Internas do Sistema
│   ├── permissions/    # Matriz de Permissões RBAC
│   ├── reports/        # Núcleo da Gestão de Manifestações e Ciclo de Vida
│   ├── roles/          # Perfis de Acesso (Administrador, Triador, Relator, etc.)
│   ├── settings/       # Configurações do Sistema e Modelos de Resposta
│   ├── units/          # Unidades Operacionais e Hospitalares do Grupo Bairral
│   └── users/          # Gestão de Usuários Internos
└── main.ts             # Entrypoint da Aplicação NestJS
```

---

## 3. Gestão de Estado no Frontend (React)

- **AuthContext**: Mantém estado de autenticação, perfil do usuário atual, permissões dinâmicas e expiração de sessão.
- **Service Layer**: Módulos em `src/services/` encapsulam chamadas à API HTTP client com suporte a modo Mock (`VITE_ENABLE_MOCKS`).
- **Resiliência HTTP**:
  - Trata respostas `401` emitindo evento global de renovação/logout.
  - Trata respostas `403` com avisos claros de permissão negada.
  - Trata `429` (Rate Limit) e `500` amigavelmente sem expor detalhes técnicos ao usuário final.
