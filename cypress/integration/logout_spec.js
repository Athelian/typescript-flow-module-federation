describe('Logout', () => {
  it('login and logout then redirect back to login page', () => {
    cy.login()
      .getByTestId('setting-button')
      .click()
      .getByTestId('logout-button')
      .click()
      .getByTestId('logout-confirm-button')
      .click()
      .url()
      .should('eq', 'http://localhost:3000/login');
  });
});
