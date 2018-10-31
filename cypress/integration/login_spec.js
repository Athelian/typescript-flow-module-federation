describe('Login', () => {
  beforeEach(() => {
    cy.fixture('user').as('userJSON');
  });

  it('Show error message when login failed', function loginFailed() {
    const { username } = this.userJSON;
    cy.visit('/login');
    cy.get('input[data-testid="email"]')
      .type(username)
      .should('have.value', username);
    cy.get('input[data-testid="password"]')
      .type('wrong')
      .should('have.value', 'wrong');
    cy.get('button[data-testid="submitButton"]').click();
    cy.wait(500);
    cy.contains('#errorMsg', 'Invalid username/password');
  });

  it('Redirect to home page after successful login', function loginSuccess() {
    const { username, password } = this.userJSON;
    cy.visit('/login');
    cy.get('input[data-testid="email"]')
      .type(username)
      .should('have.value', username);
    cy.get('input[data-testid="password"]')
      .type(`${password}`)
      .should('have.value', password);
    cy.get('button[data-testid="submitButton"]').click();
    cy.wait(500);
    cy.url().should('include', '/order');
  });
});
