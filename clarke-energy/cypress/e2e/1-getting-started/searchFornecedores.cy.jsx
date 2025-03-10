import React from "react";
import SearchFornecedores from "../../../src/components/SearchFornecedores";
import { mount } from "cypress/react";

describe('SearchFornecedores', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:5000/graphql', {
      statusCode: 200,
      body: {
        fornecedores: [
          {
            id: '1',
            name: 'Fornecedor A',
            cnpj: '12345678000101',
            state: 'São Paulo',
            costPerKwh: 0.5,
            minKwhLimit: 100,
            numClients: 50,
            averageRating: 4.5,
          },
          {
            id: '2',
            name: 'Fornecedor B',
            cnpj: '98765432000198',
            state: 'RJ',
            costPerKwh: 0.6,
            minKwhLimit: 200,
            numClients: 30,
            averageRating: 4.0,
          },
        ],
      },
    }).as('getFornecedores');


  });

  it('should display a list of fornecedores based on filters', () => {
    cy.get('select').select('São Paulo');
    cy.get('input[placeholder="Custo por kWh"]').type('0.6');
    cy.get('input[placeholder="Limite mínimo"]').type('150');
    cy.get('button').click();

    cy.wait('@getFornecedores');

    cy.get('div')
      .contains('Fornecedor A')
      .should('exist');
    cy.get('div')
      .contains('Fornecedor B')
      .should('not.exist');
  });

  it('should display a message if no fornecedores match the filters', () => {
    cy.get('select').select('SP');
    cy.get('input[placeholder="Custo por kWh"]').type('0.4');
    cy.get('input[placeholder="Limite mínimo"]').type('50');
    cy.get('button').click();

    cy.wait('@getFornecedores');

    cy.get('.text-red-500').should('exist').and('contain', 'Nenhum fornecedor encontrado');
  });
});
