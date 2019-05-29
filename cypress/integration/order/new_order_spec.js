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
        .getByTestId('newButton')
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
        .type(currency)
        .should('have.value', currency)
        .wait(500)
        .get('input[aria-labelledby="tagsTagInputs"]')
        .type('{downarrow}{enter}')
        .getByTestId('dashedButton')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .getByTestId('saveButtonOnSelectExporters')
        .click()
        .wait(1000)
        .getByTestId('saveButton')
        .click()
        .wait(1000);

      // Verify the input data is correct after saving
      cy.url().should('include', '/order/emV');

      cy.get('input[name="poNo"]')
        .should('have.value', poNo)
        .get('input[name="piNo"]')
        .should('have.value', piNo)
        .get('input[aria-labelledby="currencySearchSelectInput"]')
        .should('have.value', currency);
    });
  });
});
