# Design System — Grupo Bairral (Fase 2)

## 1. Princípios de Identidade Visual

O Design System do **Grupo Bairral** reflete a solidez e dinamismo de sua atuação nos setores industrial e logístico. As interfaces devem transmitir explicitamente:

- **Segurança & Robustez**: Estruturas visuais firmes, bordas bem definidas e contraste claro.
- **Eficiência Operacional**: Hierarquia da informação objetiva e tipografia legível.
- **Integridade & Confiança**: Uso disciplinado de cores e dados precisos com números tabulares.
- **Precisão**: Espaçamento baseado na grade rígida de 4px.

---

## 2. Paleta de Cores

### 2.1 Amarelo Marca (Destaque)
O amarelo é a cor de assinatura do Grupo Bairral. **Regra obrigatória:** O amarelo deve ser usado como destaque e acento visual, nunca como fundo dominante. Todo texto sobre fundo amarelo DEVE ser escuro/preto (#0A0A0A).

- **50**: `#FFFBEB`
- **100**: `#FFF4C2`
- **200**: `#FFE87A`
- **300**: `#FFDA3D`
- **400**: `#FFCD14`
- **500 (Principal)**: `#FDC503`
- **600**: `#DDAE00`
- **700**: `#B68C00`
- **800**: `#806300`
- **900**: `#4D3B00`

### 2.2 Escala de Neutros (Industrial/Grafite)
- **950**: `#0A0A0A` (Preto absoluto / Sidebar primária)
- **900**: `#171717` (Grafite escuro / Cabeçalhos)
- **850**: `#202020`
- **800**: `#262626`
- **700**: `#404040`
- **600**: `#525252`
- **500**: `#737373` (Texto secundário)
- **400**: `#A3A3A3`
- **300**: `#D4D4D4`
- **200**: `#E5E5E5` (Divisores e bordas)
- **100**: `#F5F5F5` (Fundo de cards secundários)
- **50**: `#FAFAFA` (Fundo da aplicação)
- **Branco**: `#FFFFFF` (Fundo de cards principais)

### 2.3 Cores Semânticas
- **Sucesso**: `#16A34A` (Apenas para conclusões positivas e status OK)
- **Atenção**: `#D97706` (Avisos operacionais e alertas)
- **Perigo**: `#DC2626` (Reservado estritamente para erros, riscos críticos e atrasos)
- **Informação**: `#2563EB` (Indicadores informativos)

---

## 3. Tipografia

- **Títulos e Destaques**: `Montserrat` (Pesos 500, 600, 700, 800)
- **Interface e Textos**: `Inter` (Pesos 300, 400, 500, 600, 700)
- **Métricas e Valores**: Números Tabulares (`font-variant-numeric: tabular-nums`)

---

## 4. Tokens de Estrutura e Estilo

- **Espaçamento**: Grade base de 4px (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`).
- **Raios de Borda**: Arredondamento controlado e sutil (`2px`, `4px`, `6px`, `8px`). Evitar pílulas ou bordas altamente arredondadas.
- **Sombras**: Sombras extremamente sutis e limpas (`shadow-subtle`, `shadow-card`).
- **Animações**: Transições diretas (`150ms` a `350ms`) com curva industrial (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 5. Diretrizes de Layout e Aplicação

1. **Interfaces Administrativas**: Fundo claro (`#FAFAFA` ou `#F5F5F5`).
2. **Sidebar**: Grafite/Preto (`#171717` / `#0A0A0A`).
3. **Sem Gradientes**: Manter cores sólidas para garantir clareza industrial.
4. **Sem Sombras Fortes**: Utilizar bordas finas (`#E5E5E5`) para definir profundidade.
