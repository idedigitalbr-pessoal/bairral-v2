# Modelo de Dados — Canal de Denúncias Grupo Bairral

Este documento descreve as entidades, enums e relacionamentos do banco de dados gerenciados via Prisma ORM.

---

## 1. Enums Principais

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  BLOCKED
}

enum ReportType {
  DEVIATION
  HARASSMENT
  DISCRIMINATION
  FRAUD
  CORRUPTION
  SAFETY
  PRIVACY
  OTHER
}

enum ReportStatus {
  SUBMITTED
  UNDER_TRIAGE
  UNDER_INVESTIGATION
  ACTION_PLAN
  CONCLUDED
  REJECTED
  ARCHIVED
}

enum SubmissionMode {
  ANONYMOUS
  IDENTIFIED
  CONFIDENTIAL
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum ActionPlanStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

---

## 2. Dicionário de Tabelas Principais

### `User`
Representa os usuários internos do sistema (administradores, membros da comissão de ética, investigadores).
- **id**: String (UUID)
- **email**: String (Unique)
- **passwordHash**: String (Hash bcrypt)
- **status**: UserStatus (`ACTIVE`, `INACTIVE`, etc.)

### `Report`
Tabela central das manifestações e denúncias cadastradas.
- **id**: String (UUID)
- **protocol**: String (Unique - Ex: `GB-202608-X8A2`)
- **trackingPasswordHash**: String (Hash bcrypt da senha de acompanhamento)
- **submissionMode**: SubmissionMode (`ANONYMOUS`, `IDENTIFIED`, `CONFIDENTIAL`)
- **status**: ReportStatus
- **riskLevel**: RiskLevel
- **dueAt**: DateTime (Data limite baseada no SLA da categoria)

### `ReporterIdentity` (Tabela Isolada para LGPD)
Guarda os dados pessoais do manifestante caso a manifestação seja identificada/sigilosa.
- **reportId**: String (FK para Report, Unique)
- **nameEncrypted**, **emailEncrypted**, **phoneEncrypted**, **cpfEncrypted**: Strings Criptografadas com AES-256.

### `ActionPlan`
Planos de ação corretivos ou preventivos vinculados a manifestações em apuração.
- **id**: String (UUID)
- **reportId**: String (FK para Report)
- **title**: String
- **status**: ActionPlanStatus (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- **responsibleUserId**: String (FK para User)

### `AuditLog`
Registro de auditoria imutável.
- **id**: String (UUID)
- **userId**: String (Nullable)
- **action**: String (Ex: `STATUS_CHANGED`, `DOWNLOAD_ATTACHMENT`)
- **entity**: String
- **entityId**: String (Nullable)
- **details**: JSON
- **ipAddress**: String
- **userAgent**: String
- **createdAt**: DateTime
