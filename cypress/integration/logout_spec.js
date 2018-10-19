describe('Logout', () => {
  it('login and logout then redirect back to login page', () => {
    cy.visit('/order')
      .getByTestId('setting-button')
      .click()
      .getByTestId('logout-button')
      .click()
      .getByTestId('logout-confirm-button')
      .click();

    cy.url().should('include', '/login');
  });
});
