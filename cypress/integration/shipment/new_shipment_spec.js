describe('Shipment', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should create a shipment without timeline', () => {
    cy.task('fixture', 'shipment').then(({ shipmentNo }) => {
      cy.visit('/shipment')
        .getByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="no"]')
        .type(shipmentNo)
        .should('have.value', shipmentNo)
        .getByTestId('btnSelectBatches')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .getByTestId('btnSaveSelectBatches')
        .click()
        .wait(1000)
        .getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      cy.get('input[name="no"]').should('have.value', shipmentNo);
    });
  });

  it('should create a shipment with timeline information', () => {
    cy.task('fixture', 'shipment').then(({ shipmentNo, cargoReadyDate }) => {
      cy.visit('/shipment')
        .getByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="no"]')
        .type(shipmentNo)
        .should('have.value', shipmentNo)
        .getByTestId('btnSelectBatches')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .getByTestId('btnSaveSelectBatches')
        .click()
        .wait(1000);

      const cargoReadyDateMoment = Cypress.moment(cargoReadyDate).format('YYYY-MM-DD');

      cy.getByTestId('cargoReady_approveButton').click();
      cy.getByTestId('cargoReady_unApproveButton').should('be.visible');
      cy.getByTestId('cargoReady_DateRevisions')
        .children()
        .should('have.length', 2);
      cy.get('input[name="cargoReady.date"]')
        .type(cargoReadyDateMoment)
        .should('have.value', cargoReadyDateMoment);

      cy.getByTestId('cargoReady_addDateButton').click();
      cy.getByTestId('cargoReady_DateRevisions')
        .children()
        .should('have.length', 3)
        .wait(500);

      cy.getByTestId('voyageSelector').click();
      cy.getByTestId('voyageOptions')
        .children()
        .should('have.length', 3);
      cy.get('input[name="no"]').should('have.value', shipmentNo);
      cy.get('input[name="cargoReady.date"]').should('have.value', cargoReadyDateMoment);
    });
  });
});
