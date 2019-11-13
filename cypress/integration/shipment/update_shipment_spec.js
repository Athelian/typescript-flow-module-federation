describe('Shipment', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should update shipment basic field', () => {
    cy.visit('/shipment')
      .get('.InfiniteScroll')
      .children()
      .first()
      .click();

    cy.url().should('include', '/shipment/emV');

    cy.task('fixture', 'shipment').then(({ blDate, incoterm }) => {
      const date = Cypress.moment(blDate).format('YYYY-MM-DD');
      cy.get('input[name="blDate"]')
        .click()
        .type(date)
        .should('have.value', date)
        .blur()
        .get('input[aria-labelledby="incotermSearchSelectInput"]')
        .clear()
        .type(incoterm)
        .should('have.value', incoterm)
        .blur()
        .findByTestId('saveButton')
        .click();
    });
  });
});
