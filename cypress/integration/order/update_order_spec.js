describe('Order update action', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should change the order info section', () => {
    // select first order
    cy.visit('/order')
      .wait(1000)
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);

    cy.url().should('include', '/order/emV');

    cy.task('fixture', 'order').then(({ poNo, issueAt, deliveryPlace, incoterm, memo }) => {
      const date = Cypress.moment(issueAt).format('YYYY-MM-DD');
      cy.get('input[name="poNo"]')
        .clear()
        .type(poNo)
        .should('have.value', poNo)
        .blur()
        .getByTestId('addAssignerButton')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .getByTestId('saveButtonOnAssignUsers')
        .click()
        .get('input[name="issuedAt"]')
        .click()
        .type(date)
        .should('have.value', date)
        .blur()
        .get('input[aria-labelledby="incotermSearchSelectInput"]')
        .clear()
        .type(incoterm)
        .should('have.value', incoterm)
        .wait(500)
        .get('input[name="deliveryPlace"]')
        .clear()
        .type(deliveryPlace)
        .should('have.value', deliveryPlace)
        .get('textarea[name="memo"]')
        .clear()
        .type(memo)
        .should('have.value', memo)
        .blur()
        .getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      // Verify the input data is correct after saving
      cy.get('input[name="poNo"]').should('have.value', poNo);
      cy.get('input[name="issuedAt"]').should('have.value', date);
      cy.get('input[aria-labelledby="incotermSearchSelectInput"]').should('have.value', incoterm);
      cy.get('input[name="deliveryPlace"]').should('have.value', deliveryPlace);
      cy.get('textarea[name="memo"]').should('have.value', memo);
    });
  });
});
