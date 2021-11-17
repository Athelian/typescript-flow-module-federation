describe('Login', () => {
  beforeEach(() => {
    cy.fixture('user').as('userJSON');
  });

  it('Show error message when login failed', function loginFailed() {
    const { username } = this.userJSON;
    cy.visit('/login');
    cy.findByTestId('email')
      .type(username)
      .should('have.value', username);
    cy.findByTestId('password')
      .type('wrong')
      .should('have.value', 'wrong');
    cy.findByTestId('submitButton')
      .click()
      .get('#errorMsg')
      .contains('Invalid username/password');
  });

  it('Redirect to home page after successful login', function loginSuccess() {
    const { username, password } = this.userJSON;
    cy.visit('/login');
    cy.findByTestId('email')
      .type(username)
      .should('have.value', username);
    cy.findByTestId('password')
      .type(`${password}`)
      .should('have.value', password);
    cy.findByTestId('submitButton')
      .click()
      .url()
      .should('include', '/order');
  });
});
