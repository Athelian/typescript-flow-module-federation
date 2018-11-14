describe('Batch', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should create a batch', () => {
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
      cy.getByTestId('addAdjustmentButton')
        .click()
        .get('input[name="batchAdjustments.0.quantity"]')
        .type(batchAdjustmentsQuantity)
        .blur();

      cy.getByTestId('currentQuantityDiv').should(
        'have.text',
        `${quantity + batchAdjustmentsQuantity}`
      );
      // package
      cy.get('input[name="packageCapacity"]').type(2);
      cy.getByTestId('calculatorButton')
        .click()
        .get('input[name="packageQuantity"]')
        .should('have.value', `${(quantity + batchAdjustmentsQuantity) / 2}`);

      cy.getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      cy.get('input[name="no"]')
        .should('have.value', batchNo)
        .get('input[name="quantity"]')
        .should('have.value', `${quantity + batchAdjustmentsQuantity}`);
    });
  });
});
