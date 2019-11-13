describe('Order items section', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should change add 3 order items as same kind', () => {
    // select first order
    cy.visit('/order')
      .get('.InfiniteScroll')
      .should('have.length', 1)
      .children()
      .first()
      .click();

    cy.url().should('include', '/order/emV');

    cy.get('#navbar-root > div > button:nth-child(3)').click();

    cy.findByTestId('btnNewItems')
      .click()
      .get('.InfiniteScroll')
      .should('have.length', 1)
      .children()
      .first()
      .click()
      .findByTestId('increaseButton')
      .click()
      .click()
      .get('[data-testid="btnSaveSelectProductProviders"]')
      .children()
      .last()
      .click()
      .get('[data-testid="btnSaveOrder"]')
      .click()
      .should('not.exist');
  });
});
