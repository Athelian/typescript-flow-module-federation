describe('Batch', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should create a batch', () => {
    // FIXME: redo
    cy.task('fixture', 'batch').then(({ batchNo, quantity, batchAdjustmentsQuantity }) => {
      cy.visit('/batch')
        .getByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="no"]')
        .type(batchNo)
        .should('have.value', batchNo)
        .get('input[name="quantity"]')
        .type(quantity)
        .blur();

      // select order item
      cy.getByTestId('selectOrderItemButton')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .getByTestId('saveButtonOnSelectOrderItem')
        .click()
        .wait(1000);

      // quantity adjustments
      cy.getByTestId('initialQuantityDiv').should('have.text', `${quantity}`);
      cy.getByTestId('btnNewQuantity')
        .click()
        .get('input[name="batchAdjustments.0.quantity"]')
        .type(batchAdjustmentsQuantity)
        .blur();

      cy.getByTestId('currentQuantityDiv').should(
        'have.text',
        `${quantity + batchAdjustmentsQuantity}`
      );

      cy.get('input[name="packageCapacity"]')
        .type(2)
        .blur();

      // auto calculate packageQuantity
      cy.get('input[name="packageQuantity"]').should(
        'have.value',
        `${(quantity + batchAdjustmentsQuantity) / 2}`
      );

      cy.getByTestId('btnSaveBatch')
        .click()
        .wait(1000);

      // Verify the input data is correct after saving
      cy.url().should('include', '/batch/emV');

      cy.get('input[name="no"]')
        .should('have.value', batchNo)
        .get('input[name="quantity"]')
        .should('have.value', `${quantity + batchAdjustmentsQuantity}`);
    });
  });
});
