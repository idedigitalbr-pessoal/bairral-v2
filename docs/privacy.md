# Política de Privacidade, Sigilo e LGPD — Grupo Bairral

Documentação referente às diretrizes de conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) e garantia de anonimato no Canal de Denúncias.

---

## 1. Princípio do Anonimato Garantido

1. **Opção por Relato Anônimo**:
   - O manifestante tem a garantia técnica e jurídica de enviar relatos sem fornecer qualquer dado de identificação pessoal (Nome, E-mail, CPF, Telefone ou Vínculo).
   - O sistema não registra o IP do manifestante no formulário de envio público.
2. **Consultas Seguras**:
   - O acompanhamento de relatos anônimos é feito exclusivamente via Protocolo + Senha de Acompanhamento gerada no momento da inclusão.

---

## 2. Tratamento de Dados de Manifestações Identificadas / Confidenciais

1. **Criptografia Forte de Dados de Identificação**:
   - Todos os dados pessoais inseridos na modalidade "Identificado" ou "Confidencial" são criptografados com algoritmo AES-256 antes de serem salvos no banco de dados.
2. **Segregação de Permissões**:
   - Usuários com perfil comum de investigação não possuem acesso aos dados descriptografados de identidade.
   - A visualização dos dados do manifestante exige a permissão especial `VIEW_REPORTER_IDENTITY`, restrita aos membros da Ouvidoria/Comitê de Ética responsável.
3. **Impossibilidade de Enumeração**:
   - IDs e protocolos são não sequenciais para impedir adivinhação.

---

## 3. Direitos do Titular de Dados e Retenção

- **Período de Retenção**: Os dados de manifestações e apurações são mantidos pelo período legal necessário para apuração, auditoria e cumprimento de deveres regulatórios.
- **Eliminação de Dados Não Relevantes**: Informações não pertinentes ao objeto da denúncia são descartadas de forma segura.
