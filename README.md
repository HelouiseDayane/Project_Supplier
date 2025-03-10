# Projeto com Flask, GraphQL, Docker e React

Este projeto é composto por um **backend** construído com **Flask** e **GraphQL**, e um **frontend** em **React**. O projeto é executado em containers Docker e inclui um **seed** para preencher automaticamente a tabela de fornecedores com dados falsos, além de testes unitários com **pytest** e testes end-to-end com **Cypress**.

## Tecnologias

- **Backend**: Python, Flask, GraphQL
- **Frontend**: React, Cypress
- **Banco de Dados**: (Por favor, especifique qual banco de dados está sendo utilizado, por exemplo: PostgreSQL, MySQL, etc.)
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
cd project COM GRAPHQL
docker-compose up --build

```
### 2. Rodar o Seed

O sistema inclui um seed que preenche automaticamente a tabela de fornecedores com 150 fornecedores de exemplo ao executar o Docker. Para rodar o seed, execute:

```bash
docker-compose exec web python3 -m app.database.seeder

```

### 3. Rodar os Testes Unitários com pytest

Depois que o container estiver rodando, você pode rodar os testes unitários com pytest dentro do container. Para isso, execute os seguintes comandos:

```bash
docker exec -it projectcomgraphql_web_1 /bin/bash
pytest

```
O pytest vai rodar todos os testes unitários do seu projeto e exibir o resultado no terminal.

### 4. Testando o CRUD

O backend oferece um CRUD que pode ser testado via GraphQL. Utilize a URL:


```bash
http://localhost:5000/graphql

```

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

