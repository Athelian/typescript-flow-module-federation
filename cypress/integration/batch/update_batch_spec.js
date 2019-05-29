describe('Batch', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('update a batch', () => {
    cy.visit('/batch')
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);

    cy.url().should('include', '/batch/emV');

    cy.task('fixture', 'batch').then(({ batchNo }) => {
      // Fill the required fields
      cy.get('input[name="no"]')
        .clear()
        .type(batchNo)
        .should('have.value', batchNo)
        .blur();

      cy.getByTestId('btnSaveBatch')
        .click()
        .wait(1000);

      cy.get('input[name="no"]').should('have.value', batchNo);
    });
  });
});
