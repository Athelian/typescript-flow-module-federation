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
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);

    cy.url().should('include', '/order/emV');

    // FIXME: should use scrollTo() method, but it doesn't work.
    cy.contains('DOCUMENTS').click();

    cy.getByTestId('btnNewItems')
      .click()
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .getByTestId('increaseButton')
      .click()
      .click()
      .getByTestId('saveButton')
      .children()
      .last()
      .click()
      .getByTestId('saveButton')
      .click()
      .wait(2000) // API slow
      .should('not.exist');
  });
});
