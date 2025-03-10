# Projeto com Flask, GraphQL, Docker e React

Este projeto é composto por um **backend** construído com **Flask** e **GraphQL**, e um **frontend** em **React**. O projeto é executado em containers Docker e inclui um **seed** para preencher automaticamente a tabela de fornecedores com dados falsos, além de testes unitários com **pytest** e testes end-to-end com **Cypress**.

## Tecnologias

- **Backend**: Python, Flask, GraphQL
- **Frontend**: React, Cypress
- **Banco de Dados**: PostgreSQL
- **Docker**: Para containerização de serviços
- **Tests**: pytest (unitários), Cypress (end-to-end)

## Pré-requisitos

Antes de rodar o projeto, você precisa garantir que tenha o seguinte instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (para o front-end React)
- [Python 3](https://www.python.org/downloads/)

## Rodando o Backend (Flask + GraphQL)

### 1. Executar o Docker

Primeiro, você precisa construir e iniciar os containers do Docker para o projeto. Execute o seguinte comando para construir a imagem e rodar os containers:

```bash
cd project-suppliers
docker-compose up --build -d

```
### 2. Rodar o Seed

O sistema inclui um seed que preenche automaticamente a tabela de fornecedores com 150 fornecedores de exemplo e a migrate. Para rodar o seed manualmente, execute:


```
docker exec -it  project-suppliers_web_1 /bin/bash
flask db upgrade


```
em seguida

```
 python3 -m app.database.seeder

```

### 3. Rodar os Testes Unitários com pytest

Depois que o container estiver rodando, você pode rodar os testes unitários com pytest dentro do container. Para isso, ainda dento do mesmo container (bash) execute os seguintes comandos:

```bash

pytest

```
O pytest vai rodar todos os testes unitários do seu projeto e exibir o resultado no terminal.

### 4. Testando o CRUD

O backend oferece um CRUD que pode ser testado via GraphQL. Utilize a URL:


```bash
http://localhost:5000/graphql

```

 - Para obter uma lista de todos os fornecedores cadastrados, utilize a seguinte query:
 ```bash
query {
  fornecedores {
    id
    name
    cnpj
    state
    costPerKwh
    minKwhLimit
    numClients
    averageRating
  }
}
```

 - 
 - 
 - 
 - 
 - 

## Rodando o Frontend (React)

### 1. Executar o Frontend

Para rodar o frontend com React, você precisa navegar até a pasta do frontend e executar o servidor de desenvolvimento:

```bash
cd clarke-energry
npm install
npm run dev

```
Isso vai iniciar o servidor React na porta 5173, e você pode acessar a aplicação em:

Página inicial: http://localhost:5173
Página de criação de fornecedor: http://localhost:5173/create-supplier


## Estrutura do Projeto

### Backend
 - app/: Contém a aplicação Flask
 - graphql/: Contém os schemas e resolvers GraphQL
 - database/: Contém a configuração e o seed para o banco de dados usando migrate
 - models/: Modelos para interagir com o banco de dados
 - views/: Controladores de lógica do servidor Flask
 - Dockerfile: Arquivo para construir a imagem Docker do backend
 - docker-compose.yml: Arquivo de configuração do Docker Compose para rodar o projeto

### Frontend

 - frontend/: Contém a aplicação React
   * src/: Arquivos fontes do React
   * public/: Arquivos públicos, como o index.html
   * cypress/: Contém os testes end-to-end configurados com Cypress

### Comandos Úteis
 - Construir e iniciar os containers do Docker:

 ```bash
cd project-suppliers
docker-compose up --build


```

 - Executar a migrate (tabela do banco de dados)


 ```bash
docker exec -it projectcomgraphql_web_1 /bin/bash
flask db upgrade

```

 - Executar o seed para preencher a tabela de fornecedores:

  ```bash
docker-compose exec web python3 -m app.database.seeder

```

 - Rodar os testes unitários com pytest:

  ```bash
docker exec -it projectcomgraphql_web_1 /bin/bash
pytest

```

 - Rodar o frontend (React):

  ```bash
    cd clarke-energy
    npm install
    npm run dev

  ```

## Licença

Este projeto é licenciado sob a MIT License.


### Explicação dos pontos importantes:

1. **Docker**: A documentação explica como construir o Docker e rodar o seed para preencher automaticamente a tabela de fornecedores com dados gerados.
2. **Testes Unitários**: A documentação explica como rodar os testes unitários com `pytest` dentro do container Docker.
3. **Frontend**: Instruções para rodar o servidor de desenvolvimento do React e acessar as páginas do sistema.
4. **Testes E2E (Cypress)**: A documentação inclui instruções sobre como rodar os testes de integração/end-to-end usando Cypress.
5. **Comandos úteis**: Cada comando necessário para o fluxo de trabalho é listado.








