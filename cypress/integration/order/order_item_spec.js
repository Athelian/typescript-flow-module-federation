describe('Order', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should change add 3 order items as same kind', () => {
    // go to detail
    cy.visit('/order')
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);

    cy.url().should('include', '/order/emV');

    cy.getByTestId('newButton')
      .click()
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .get('button[data-testid="increaseButton"]')
      .click()
      .click()
      .get('button[data-testid="saveButton"]')
      .children()
      .last()
      .click()
      .get('button[data-testid="saveButton"]')
      .click()
      .wait(1000)
      .should('not.exist');
  });
});
