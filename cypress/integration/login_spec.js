describe('Login', () => {
  beforeEach(() => {
    cy.fixture('user').as('userJSON');
  });

  it('Show error message when login failed', function loginFailed() {
    const { username } = this.userJSON;
    cy.visit('/login');
    cy.getByTestId('email')
      .type(username)
      .should('have.value', username);
    cy.getByTestId('password')
      .type('wrong')
      .should('have.value', 'wrong');
    cy.getByTestId('submitButton')
      .click()
      .get('#errorMsg')
      .contains('Invalid username/password');
  });

  it('Redirect to home page after successful login', function loginSuccess() {
    const { username, password } = this.userJSON;
    cy.visit('/login');
    cy.getByTestId('email')
      .type(username)
      .should('have.value', username);
    cy.getByTestId('password')
      .type(`${password}`)
      .should('have.value', password);
    cy.getByTestId('submitButton')
      .click()
      .url()
      .should('include', '/order');
  });
});
