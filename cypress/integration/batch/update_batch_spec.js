describe('Batch', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('update a batch', () => {
    cy.visit('/batch')
      .get('.InfiniteScroll')
      .children()
      .first()
      .click();

    cy.url().should('include', '/batch/emV');

    cy.task('fixture', 'batch').then(({ batchNo }) => {
      // Fill the required fields
      cy.get('input[name="no"]')
        .clear()
        .type(batchNo)
        .should('have.value', batchNo)
        .blur();

      cy.findByTestId('btnSaveBatch')
        .click()
        .get('input[name="no"]')
        .should('have.value', batchNo);
    });
  });
});
