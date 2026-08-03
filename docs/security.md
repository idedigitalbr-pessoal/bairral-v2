# Políticas e Especificações de Segurança — Grupo Bairral

Este documento reúne todas as medidas de segurança cibernética, proteção de dados (LGPD) e controle de acesso implementadas no sistema.

---

## 1. Tratamento de Senhas e Criptografia

- **Senhas de Usuários Internos**: Criptografadas via `bcrypt` com salt factor 10.
- **Senhas de Acompanhamento de Manifestações**:
  - Exigem complexidade mínima (mínimo 8 caracteres, maiúsculas, minúsculas e números).
  - Salvas em formato de hash irreversível via `bcrypt`.
- **Dados Pessoais do Manifestante (LGPD)**:
  - Armazenados na tabela isolada `ReporterIdentity`.
  - Atributos `nameEncrypted`, `emailEncrypted`, `phoneEncrypted`, `cpfEncrypted` e `relationToCompanyEncrypted` são cifrados utilizando AES-256-CBC.
  - A chave de criptografia é gerada via variável de ambiente `CRYPTO_SECRET_KEY`.

---

## 2. Controle de Acesso Baseado em Funções (RBAC)

O acesso às rotas administrativas exige um JSON Web Token (JWT) válido e a permissão específica declarada via decorator `@RequirePermissions(...)`.

| Permissão | Descrição |
| :--- | :--- |
| `VIEW_DASHBOARD` | Visualizar indicadores e relatórios consolidados no Dashboard |
| `VIEW_CASES` | Listar e visualizar relatos e manifestações |
| `TRIAGE_CASES` | Alterar classificação, prioridade e triagem inicial |
| `ASSIGN_CASES` | Atribuir ou reatribuir investigadores e relatores a um caso |
| `CHANGE_CASE_STATUS` | Alterar o status do ciclo de vida da manifestação |
| `VIEW_REPORTER_IDENTITY` | Descriptografar e visualizar identidade de relatos identificados/confidenciais |
| `SEND_MESSAGES` | Enviar mensagens públicas ao manifestante |
| `ADD_INTERNAL_COMMENTS` | Incluir comentários internos sigilosos na apuração |
| `CREATE_ACTION_PLAN` | Criar e gerenciar planos de ação preventiva/corretiva |
| `ACCESS_ATTACHMENTS` | Fazer upload e download auditado de anexos e evidências |
| `ACCESS_AUDIT` | Consultar logs imutáveis de auditoria e governança |
| `MANAGE_USERS` | Criar e editar contas de usuários administrativos |
| `MANAGE_SETTINGS` | Configurar parâmetros gerais e modelos de comunicação |

---

## 3. Segurança em Uploads e Arquivos

- **Validação de Tipos**: Permitidos apenas extensores de arquivos validados (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.txt`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.mp3`, `.mp4`, `.zip`).
- **Prevenção contra Path Traversal**: Sanitização estrita de caminhos (`path.resolve` e verificação de raiz `uploadDir`).
- **Nomes Não Enumeráveis**: Todo arquivo salvo no disco recebe um sufixo `timestamp_hexrandom` para impedir adivinhação ou acesso direto.
- **Download Auditado**: Todo download efetuado por investigares gera um log na auditoria com IP, User-Agent e ID do usuário.

---

## 4. Prevenção contra Ataques Comuns

- **Rate Limiting (Proteção contra Brute Force e Enumeração de Protocolos)**:
  - Limite de requisições por IP nas rotas de envio de relatos e consulta por senha.
- **CORS Configurado**: Restrição de origens via variável `CORS_ORIGIN`.
- **Tratamento Seguro de Erros**: Respostas de erro para o cliente nunca expõem stack traces, credenciais ou estruturas internas de banco de dados.
