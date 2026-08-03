# Arquitetura do Sistema — Canal de Denúncias Grupo Bairral

Este documento detalha a arquitetura técnica, fluxo de dados e integrações da plataforma do Canal de Denúncias do Grupo Bairral.

---

## 1. Visão Geral da Arquitetura

O sistema é construído utilizando uma arquitetura em camadas desacoplada (Frontend SPA + API RESTful NestJS + Banco de Dados Relacional Prisma ORM).

```mermaid
graph TD
    Client[Navegador / SPA React] -->|HTTPS / REST API| Gateway[API Gateway / NestJS Controller]
    Gateway -->|Guards / RBAC / JWT| Services[Camada de Serviços / Business Logic]
    Services -->|Prisma Client| DB[(Banco de Dados Relacional - MySQL)]
    Services -->|Armazenamento Local Seguro| Storage[Diretório de Uploads Protegido]
    Services -->|Logs Imutáveis| Audit[Serviço de Auditoria]
```

---

## 2. Diagrama de Autenticação e Autorização (RBAC)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador / Investigador
    participant SPA as Frontend React
    participant Auth as NestJS AuthController
    participant JWT as JwtAuthGuard & PermissionsGuard
    participant DB as Prisma (MySQL)

    Admin->>SPA: Preenche E-mail e Senha
    SPA->>Auth: POST /api/v1/auth/login
    Auth->>DB: Busca usuário e valida senha (bcrypt)
    DB-->>Auth: Usuário & Perfis (Roles)
    Auth-->>SPA: Retorna accessToken (JWT) e Dados do Perfil
    SPA->>SPA: Armazena token com segurança
    Admin->>SPA: Acessa área restrita de manifestações
    SPA->>JWT: Request com Header Authorization: Bearer <Token>
    JWT->>JWT: Valida expiração, assinatura e permissões (RequirePermissions)
    JWT-->>SPA: Permite acesso ao recurso
```

---

## 3. Diagrama de Registro de Manifestação Pública

```mermaid
sequenceDiagram
    autonumber
    actor User as Manifestante (Anônimo / Identificado)
    participant SPA as Frontend (Formulário)
    participant API as NestJS ReportsController
    participant Crypto as Serviço de Criptografia AES
    participant DB as Prisma (MySQL)

    User->>SPA: Preenche dados do relato, local, envolvidos e anexo
    User->>SPA: Seleciona modo (Anônimo / Sigiloso)
    SPA->>API: POST /api/v1/public/reports
    API->>API: Gerador de Protocolo Seguro (Ex: GB-202608-X8A2)
    API->>API: Hash Bcrypt da Senha de Acompanhamento
    alt Se Identificado
        API->>Crypto: Criptografa Nome, E-mail, CPF com chave AES-256
        Crypto-->>API: Dados Criptografados (ReporterIdentity)
    end
    API->>DB: Salva Report + Status HISTORY + Attachments
    DB-->>API: Confirmação de Persistência
    API-->>SPA: Retorna Protocolo e Comprovante de Registro
    SPA-->>User: Exibe Tela de Sucesso com Protocolo e Senha
```

---

## 4. Diagrama de Acompanhamento pelo Manifestante

```mermaid
sequenceDiagram
    autonumber
    actor User as Manifestante
    participant SPA as Portal de Acompanhamento
    participant API as Messages / Reports Public API
    participant DB as Prisma (MySQL)

    User->>SPA: Informa Protocolo e Senha de Acompanhamento
    SPA->>API: POST /api/v1/public/reports/:protocol/consult
    API->>DB: Busca relato pelo protocolo
    API->>API: Compara senha com hash (bcrypt.compare)
    alt Senha Válida
        API-->>SPA: Retorna status público, prazo SLA e mensagens públicas
        SPA-->>User: Exibe linha do tempo e canal de conversa
    else Senha Incorreta
        API-->>SPA: Erro 401 (Senha de acompanhamento incorreta)
    end
```

---

## 5. Diagrama de Tratamento, Triagem e Planos de Ação

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Investigador / Comitê de Ética
    participant SPA as Painel de Gestão
    participant API as Reports & ActionPlans API
    participant Audit as AuditService
    participant DB as Prisma (MySQL)

    Admin->>SPA: Altera status para "Em Apuração" / "Plano de Ação"
    SPA->>API: PATCH /api/v1/admin/reports/:id/status
    API->>DB: Registra StatusHistory e atualiza Report
    API->>Audit: Registra log de auditoria da alteração
    Admin->>SPA: Cria Plano de Ação (Ação Corretiva/Preventiva)
    SPA->>API: POST /api/v1/admin/reports/:id/action-plans
    API->>DB: Cria registro de ActionPlan
    DB-->>SPA: Retorna Plano de Ação criado
```

---

## 6. Diagrama de Upload e Download Seguro de Anexos

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário / Investigador
    participant API as AttachmentsController
    participant Provider as LocalStorageProvider
    participant Audit as AuditService
    participant FS as Disco Rígido Protegido

    User->>API: Envia arquivo multipart/form-data
    API->>Provider: Valida extensão, MimeType e Path Traversal
    Provider->>FS: Salva com nome hash não sequencial (Date_random.ext)
    API->>Audit: Registra upload no log de auditoria
    API-->>User: Anexo registrado com sucesso
```

---

## 7. Diagrama de Auditoria e Governança Imutável

```mermaid
graph LR
    Actions[Ações do Usuário: Login, Download, Alteração de Status, Resposta] --> AuditService[Serviço Central de Auditoria]
    AuditService --> Sanitize[Sanitização de IP e User-Agent]
    Sanitize --> DB[(Tabela AuditLog - ReadOnly)]
    DB --> AdminView[Visualizador de Auditoria - Acesso Restrito ACCESS_AUDIT]
```

---

## 8. Diagrama de Implantação (Deployment)

```mermaid
graph TD
    SubGraph1[Ambiente Cloud / Docker Container]
    ClientBrowser[Navegador do Usuário] -->|Porta 3000| NginxProxy[Nginx Reverse Proxy]
    NginxProxy -->|Static Frontend Assets / SPA| ReactBuild[Dist Frontend]
    NginxProxy -->|Proxy /api/*| NestServer[NestJS Node Server - Porta 3000]
    NestServer --> DB[(MySQL / PostgreSQL Database)]
    NestServer --> UploadsDir[/uploads - Diretório Restrito]
```
