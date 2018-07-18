describe('Login', () => {
  it('Show error message when login failed', () => {
    cy.visit('/login');
    const username = 'importer@zenport.io';
    cy.get('#root > div > form > div > div:nth-child(1) > input')
      .type(username)
      .should('have.value', username);
    cy.get('#root > div > form > div > div:nth-child(2) > input')
      .type('wrong{enter}')
      .should('have.value', 'wrong');
    cy.wait(500);
    cy.contains('#errorMsg', 'Invalid username/password');
  });

  it('Redirect to home page after successful login', () => {
    cy.visit('/login');
    const username = 'importer@zenport.io';
    const password = 'password';
    cy.get('#root > div > form > div > div:nth-child(1) > input')
      .type(username)
      .should('have.value', username);
    cy.get('#root > div > form > div > div:nth-child(2) > input')
      .type(`${password}{enter}`)
      .should('have.value', password);
    cy.wait(500);
    cy.getCookie('token').should('exist');
  });
});
