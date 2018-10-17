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
const user = {
  username: 'importer@zenport.io',
  password: 'password',
};
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  const { username, password } = user;
  cy.get('input[data-testid="email"]')
    .type(username)
    .should('have.value', username);
  cy.get('input[data-testid="password"]')
    .type(`${password}`)
    .should('have.value', password)
    .blur();
  cy.get('button[data-testid="submitButton"]').click();
  cy.wait(500);
});
Cypress.Commands.add('logout', () => {
  cy.visit('/order')
    .getByTestId('setting-button')
    .click()
    .getByTestId('logout-button')
    .click()
    .getByTestId('logout-confirm-button')
    .click();
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
