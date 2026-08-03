# Especificação da API RESTful — Grupo Bairral

Documentação dos principais endpoints expostos pela API NestJS. A especificação interativa OpenAPI/Swagger está disponível em `/api/docs` ao rodar a API.

---

## 1. Rotas Públicas (Manifestante)

### `POST /api/v1/public/reports`
Registra um novo relato ou denúncia.
- **Payload**:
  ```json
  {
    "type": "HARASSMENT",
    "title": "Relato de desvio de conduta",
    "description": "Descrição detalhada do ocorrido...",
    "submissionMode": "ANONYMOUS",
    "categoryId": "uuid-cat-1",
    "unitId": "uuid-unit-1",
    "trackingPassword": "SenhaSegura123"
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "protocol": "GB-202608-X8A2",
    "createdAt": "2026-08-01T20:00:00.000Z",
    "status": "SUBMITTED"
  }
  ```

### `POST /api/v1/public/reports/:protocol/consult`
Consulta o status e histórico público de uma manifestação.
- **Payload**:
  ```json
  {
    "trackingPassword": "SenhaSegura123"
  }
  ```

### `POST /api/v1/public/reports/:protocol/messages`
Envia uma mensagem pública do manifestante para a comissão.

---

## 2. Rotas Autenticadas (Administração & Investigação)

### `POST /api/v1/auth/login`
Autenticação de usuários administrativos.
- **Resposta**: Retorna token JWT e informações do usuário.

### `GET /api/v1/admin/reports`
Lista manifestações cadastradas com filtros por status, categoria, unidade, período e busca textual.

### `PATCH /api/v1/admin/reports/:id/status`
Atualiza o status do fluxo de apuração de uma manifestação.
- **Requer Permissão**: `CHANGE_CASE_STATUS`

### `POST /api/v1/admin/reports/:id/action-plans`
Cria um plano de ação atrelado à manifestação.
- **Requer Permissão**: `CREATE_ACTION_PLAN`

### `GET /api/v1/admin/dashboard/metrics`
Retorna métricas consolidadas, totalizadores, taxas de cumprimento de SLA, tempo médio de triagem/conclusão e volumes por categoria/unidade.
- **Requer Permissão**: `VIEW_DASHBOARD`

### `GET /api/v1/admin/audit-logs`
Lista os logs imutáveis de auditoria.
- **Requer Permissão**: `ACCESS_AUDIT`
