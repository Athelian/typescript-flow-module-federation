describe('Logout', () => {
  it('login and logout then redirect back to login page', () => {
    cy.visit('/order')
      .findByTestId('setting-button')
      .click()
      .findByTestId('logout-button')
      .click()
      .findByTestId('logout-confirm-button')
      .click();

    cy.url().should('include', '/login');
  });
});
