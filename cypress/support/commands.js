// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', () => {
  Cypress.log({
    name: 'login',
  });

  cy.fixture('user').then(({ username, password }) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      url: Cypress.env('graphql'),
      body: {
        query: `mutation ($input: CredentialsInput!) {
          login(input: $input) {
            token {
              token
            }
          }
        }`,
        variables: {
          input: {
            email: username,
            password,
          },
        },
      },
    };
    cy.request(options);
  });
});
Cypress.Commands.add('logout', () => {
  Cypress.log({
    name: 'logout',
  });

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    url: Cypress.env('graphql'),
    body: {
      query: 'mutation {  logout }',
    },
  };
  cy.request(options);
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
