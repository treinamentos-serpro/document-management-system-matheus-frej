# Especificação - Document Management System

## 1. Objetivo

Disponibilizar uma aplicação web para que usuários enviem, consultem e baixem documentos, mantendo os arquivos no filesystem local da aplicação e seus metadados em memória.

## 2. Escopo

### Dentro do escopo

- Upload de um documento por vez por meio de `multipart/form-data`.
- Associação de cada documento a um usuário proprietário informado na requisição.
- Geração de identificador único e registro de metadados do documento enviado.
- Listagem dos metadados de todos os documentos cadastrados.
- Download de um documento a partir de seu identificador.
- Interface web React para enviar, visualizar e baixar documentos.
- Armazenamento dos arquivos em diretório local controlado pela aplicação.

### Fora do escopo

- Armazenamento externo, em nuvem ou integração com provedores de terceiros.
- Banco de dados ou persistência de metadados entre reinicializações da aplicação.
- Autenticação, autorização e gestão completa de contas de usuário.
- Versionamento, edição, exclusão, compartilhamento ou busca avançada de documentos.
- Upload de múltiplos arquivos na mesma requisição.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o envio de um documento por meio do endpoint de upload. |
| RF-02 | O upload deve receber um arquivo no campo `file` e o identificador textual do proprietário no campo `owner`. |
| RF-03 | O sistema deve rejeitar uploads sem arquivo ou sem proprietário informado. |
| RF-04 | Após um upload válido, o sistema deve gerar um identificador único e registrar os metadados do documento. |
| RF-05 | O sistema deve gravar o arquivo recebido no diretório local de armazenamento configurado. |
| RF-06 | O sistema deve disponibilizar a listagem de metadados dos documentos cadastrados. |
| RF-07 | O sistema deve permitir o download de um documento pelo seu identificador. |
| RF-08 | O download deve preservar o nome original do arquivo para o usuário. |
| RF-09 | O sistema deve responder com erro apropriado quando o identificador solicitado não corresponder a um documento cadastrado ou quando o arquivo local não estiver disponível. |
| RF-10 | A interface web deve permitir enviar um documento, exibir os documentos retornados pela API e acionar seu download. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | O backend deve ser implementado em Node.js com Express e CommonJS. |
| RNF-02 | O upload deve usar `multer` com `diskStorage`; os arquivos não podem ser armazenados em serviços externos. |
| RNF-03 | Por padrão, os arquivos devem ser gravados em `backend/storage`. |
| RNF-04 | O diretório de armazenamento deve ser configurável por variável de ambiente, com valor padrão local. |
| RNF-05 | Os metadados devem permanecer somente em memória nesta fase e serão perdidos ao reiniciar o processo. |
| RNF-06 | As configurações de ambiente, como porta e diretório de armazenamento, devem seguir o princípio 12-Factor App. |
| RNF-07 | O backend deve respeitar o fluxo `routes -> controllers -> services -> repositories`. |
| RNF-08 | Mensagens expostas ao usuário devem estar em português. |
| RNF-09 | O frontend deve usar React, Vite e `fetch` com o prefixo `/api`. |
| RNF-10 | Os comportamentos do backend devem ter cobertura de testes com o runner nativo `node:test`. |

## 5. Modelo de dados

### Documento

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | Sim | Identificador único gerado pelo sistema. |
| `originalName` | string | Sim | Nome original do arquivo enviado. |
| `storedName` | string | Sim | Nome gerado internamente para o arquivo no filesystem; não deve ser exposto como contrato público. |
| `size` | number | Sim | Tamanho do arquivo em bytes. |
| `mimeType` | string | Sim | Tipo MIME informado pelo upload. |
| `uploadedAt` | string | Sim | Data e hora do upload no formato ISO 8601. |
| `owner` | string | Sim | Identificador textual do usuário proprietário. |

### Representação pública

As respostas de criação e listagem devem expor apenas `id`, `originalName`, `size`, `mimeType`, `uploadedAt` e `owner`. O campo `storedName` é interno e só pode ser usado pelo backend para localizar o arquivo.

## 6. Contratos de API

O frontend acessa os endpoints pelo prefixo `/api`. Os caminhos abaixo representam os endpoints internos do backend antes desse prefixo.

### POST /upload

Envia um documento e registra seus metadados.

**Requisição**

- `Content-Type`: `multipart/form-data`
- Campo `file`: arquivo obrigatório.
- Campo `owner`: texto obrigatório com o identificador do proprietário.

**Resposta de sucesso**

- Status: `201 Created`
- Corpo:

```json
{
  "id": "a1b2c3d4",
  "originalName": "relatorio.pdf",
  "size": 102400,
  "mimeType": "application/pdf",
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "usuario-123"
}
```

**Erros**

| Status | Condição | Corpo |
| --- | --- | --- |
| `400 Bad Request` | Arquivo ausente, proprietário ausente ou dados inválidos. | `{ "error": "Arquivo e proprietário são obrigatórios." }` |
| `500 Internal Server Error` | Falha ao gravar o arquivo ou registrar os metadados. | `{ "error": "Não foi possível enviar o documento." }` |

### GET /documents

Lista os metadados públicos dos documentos cadastrados.

**Resposta de sucesso**

- Status: `200 OK`
- Corpo:

```json
[
  {
    "id": "a1b2c3d4",
    "originalName": "relatorio.pdf",
    "size": 102400,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "usuario-123"
  }
]
```

Uma coleção sem documentos deve retornar `200 OK` com `[]`.

**Erros**

| Status | Condição | Corpo |
| --- | --- | --- |
| `500 Internal Server Error` | Falha inesperada ao consultar os metadados. | `{ "error": "Não foi possível listar os documentos." }` |

### GET /documents/:id/download

Envia o conteúdo binário de um documento identificado por `id`.

**Parâmetro de rota**

| Nome | Tipo | Descrição |
| --- | --- | --- |
| `id` | string | Identificador único do documento. |

**Resposta de sucesso**

- Status: `200 OK`
- Corpo: conteúdo binário do arquivo.
- Cabeçalhos esperados: `Content-Type` compatível com o tipo MIME registrado e `Content-Disposition: attachment` com o nome original do arquivo.

**Erros**

| Status | Condição | Corpo |
| --- | --- | --- |
| `404 Not Found` | Metadado não encontrado ou arquivo local inexistente. | `{ "error": "Documento não encontrado." }` |
| `500 Internal Server Error` | Falha inesperada ao preparar a resposta de download. | `{ "error": "Não foi possível baixar o documento." }` |

## 7. Decisões arquiteturais

### Backend

A separação de responsabilidades seguirá uma Clean Architecture simples dentro de `backend/src`:

| Camada | Responsabilidade |
| --- | --- |
| `routes/` | Define os caminhos HTTP, associa o middleware do `multer` e delega para os controllers. |
| `controllers/` | Lê parâmetros e corpo da requisição, executa validações HTTP básicas e transforma resultados e erros em respostas HTTP. |
| `services/` | Implementa as regras de negócio de criar, listar e recuperar documentos. |
| `repositories/` | Mantém e consulta os metadados em memória. |

As dependências devem fluir somente de `routes` para `controllers`, de `controllers` para `services` e de `services` para `repositories`. Nenhuma camada interna deve depender de Express, objetos HTTP ou componentes do frontend.

O `multer` deve utilizar `diskStorage` para escrever arquivos no filesystem local. O serviço deve persistir somente metadados depois que o middleware concluir o armazenamento do arquivo. O caminho físico do arquivo deve ser obtido a partir do metadado interno encontrado pelo `id`, e nunca a partir de um caminho enviado pelo cliente.

### Frontend

O frontend deve ser composto por componentes funcionais React organizados em `components/`, `pages/` e `services/`. O serviço HTTP centraliza chamadas com `fetch` para `/api`. A página principal reúne o formulário de upload e a listagem com ações de download, tratando os estados de carregamento, sucesso e erro em português.

## 8. Critérios de aceite

1. Um usuário consegue enviar um arquivo válido acompanhado de um proprietário e recebe `201` com seus metadados públicos.
2. O arquivo enviado existe no diretório local configurado e os metadados não expõem o nome interno de armazenamento.
3. Uma requisição de upload sem arquivo ou sem proprietário recebe `400` com uma mensagem em português.
4. A listagem retorna todos os documentos enviados durante a execução atual do backend e retorna uma lista vazia quando não há documentos.
5. Um identificador válido permite baixar o mesmo conteúdo enviado com o nome original do arquivo.
6. Um identificador inexistente, ou cujo arquivo não esteja disponível, recebe `404` sem expor caminhos locais.
7. Os testes do backend cobrem os fluxos de sucesso e erro de upload, listagem e download.
8. O frontend consegue consumir os endpoints por `/api` sem configurar diretamente a URL do backend.

## 9. Plano de execução

1. Definir as variáveis de ambiente do backend, incluindo porta e diretório local de armazenamento, com valores padrão adequados ao desenvolvimento.
2. Preparar o diretório `backend/storage` e configurar o `multer.diskStorage` com destino local e nome interno seguro para os arquivos.
3. Implementar o repositório de metadados em memória, com operações para adicionar, listar e localizar documentos por identificador.
4. Implementar o serviço de documentos para criar metadados a partir do arquivo armazenado, listar documentos e recuperar um documento para download.
5. Implementar controllers com validação das entradas HTTP, códigos de resposta e mensagens de erro em português.
6. Implementar rotas de upload, listagem e download, conectando middleware, controllers e o prefixo de API.
7. Criar testes de backend com `node:test` para upload bem-sucedido, validações, listagem, download e documento inexistente.
8. Implementar o serviço HTTP do frontend usando `fetch` e o prefixo `/api`.
9. Criar os componentes e a página React para formulário de upload, feedback de requisição e listagem de documentos com download.
10. Validar os testes do backend, o build do frontend e o funcionamento integrado dos fluxos previstos.
