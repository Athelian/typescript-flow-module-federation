describe('Order create action', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should create new an order', () => {
    cy.task('fixture', 'order').then(({ poNo, piNo, currency }) => {
      // Open order detail
      cy.visit('/order')
        .findByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="poNo"]')
        .type(poNo)
        .should('have.value', poNo)
        .get('input[name="piNo"]')
        .type(piNo)
        .should('have.value', piNo)
        .get('input[aria-labelledby="currencySearchSelectInput"]')
        .type(`${currency}{downarrow}{enter}`)
        .should('have.value', currency)
        .get('input[aria-labelledby="tagsTagInputs"]')
        .type('{downarrow}{enter}')
        .findByTestId('dashedButton')
        .click()
        .get('.InfiniteScroll')
        .should('have.length', 1)
        .children()
        .first()
        .click()
        .get('[data-testid="btnSaveExporter"]')
        .click()
        .get('[data-testid="btnSaveOrder"]')
        .click();
    });
  });
});
