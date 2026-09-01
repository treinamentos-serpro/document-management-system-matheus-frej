---
description: Cria uma nova tela responsiva no frontend React do DMS.
name: criar-tela-frontend
argument-hint: nome e objetivo da tela (ex. detalhes do documento)
agent: Expert React Frontend Engineer
---

# Criar tela no frontend

Crie a tela `${input:tela:nome e objetivo da tela}` no frontend do Document Management System.

Antes de editar, leia os componentes, o cliente de API e os estilos existentes em `frontend/src` para manter as convenções do projeto.

Requisitos:

- Use React 19.2, JavaScript puro, componentes funcionais e Hooks.
- Crie a tela em `frontend/src/pages` e extraia para `frontend/src/components` apenas elementos reutilizáveis ou com responsabilidade própria.
- Centralize chamadas HTTP em `frontend/src/services`, usando `fetch` e o prefixo `/api`; não faça chamadas HTTP diretamente nos componentes.
- Preserve o padrão visual existente: tipografia serifada, elementos monoespaçados para metadados, fundo claro com grade sutil, paleta verde, terracota e amarelo, bordas discretas e raios pequenos.
- Use HTML semântico, rótulos associados aos campos, foco visível e mensagens de erro com `role="alert"` quando apropriado.
- Implemente estados de carregamento, vazio, sucesso e erro pertinentes ao fluxo da tela.
- Garanta layout responsivo a partir de 320px, sem sobreposição ou corte de conteúdo.
- Mantenha textos exibidos ao usuário e eventuais comentários em português; use inglês para nomes de símbolos no código.
- Não adicione dependências sem necessidade e não altere funcionalidades não relacionadas.

Ao concluir:

1. Integre a tela ao ponto de entrada ou à navegação existente, quando aplicável.
2. Rode `npm run build` no diretório `frontend`.
3. Informe os arquivos criados ou alterados e o resultado da validação.