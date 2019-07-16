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
      .children()
      .first()
      .click();

    cy.url().should('include', '/order/emV');

    // FIXME: should use scrollTo() method, but it doesn't work.
    cy.contains('DOCUMENTS').click();

    cy.getByTestId('btnNewItems')
      .click()
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .getByTestId('increaseButton')
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
