describe('Login', () => {
  it('Show error message when login failed', () => {
    cy.visit('/login');
    const username = 'importer@zenport.io';
    cy.get('input[data-testid="email"]')
      .type(username)
      .should('have.value', username);
    cy.get('input[data-testid="password"]')
      .type('wrong{enter}')
      .should('have.value', 'wrong')
      .blur();
    cy.get('button[data-testid="submitButton"]').click();
    cy.wait(500);
    cy.contains('#errorMsg', 'Invalid username/password');
  });

  it('Redirect to home page after successful login', () => {
    cy.visit('/login');
    const username = 'importer@zenport.io';
    const password = 'password';
    cy.get('input[data-testid="email"]')
      .type(username)
      .should('have.value', username);
    cy.get('input[data-testid="password"]')
      .type(`${password}{enter}`)
      .should('have.value', password)
      .blur();
    cy.get('button[data-testid="submitButton"]').click();
    cy.wait(500);
    cy.url().should('include', '/order');
  });
});
