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
        .findByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="no"]')
        .type(shipmentNo)
        .should('have.value', shipmentNo)
        .get('#navbar-root > div > button:nth-child(4)')
        .click()
        .findByTestId('btnSelectBatches')
        .click()
        .get('.InfiniteScroll')
        .should('have.length', 1)
        .children()
        .first()
        .click()
        .findByTestId('saveButtonOnSelectContainerBatches')
        .click()
        .findByTestId('saveButton')
        .click()
        .should('not.exist');

      cy.get('input[name="no"]').should('have.value', shipmentNo);
    });
  });

  it('should create a shipment with timeline information', () => {
    cy.task('fixture', 'shipment').then(({ shipmentNo, cargoReadyDate }) => {
      cy.visit('/shipment')
        .findByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="no"]')
        .type(shipmentNo)
        .should('have.value', shipmentNo)
        .get('#navbar-root > div > button:nth-child(4)')
        .click()
        .findByTestId('btnSelectBatches')
        .click()
        .get('.InfiniteScroll')
        .should('have.length', 1)
        .children()
        .first()
        .click()
        .findByTestId('saveButtonOnSelectContainerBatches')
        .click();

      const cargoReadyDateMoment = Cypress.moment(cargoReadyDate).format('YYYY-MM-DD');

      cy.findByTestId('cargoReady_approveButton').click();
      cy.findByTestId('cargoReady_unApproveButton').should('be.visible');
      cy.findByTestId('cargoReady_DateRevisions')
        .children()
        .should('have.length', 2);
      cy.get('input[name="cargoReady.date"]')
        .type(cargoReadyDateMoment)
        .should('have.value', cargoReadyDateMoment);

      cy.findByTestId('cargoReady_addDateButton').click();
      cy.findByTestId('cargoReady_DateRevisions')
        .children()
        .should('have.length', 3);

      cy.findByTestId('voyageSelector').click();
      cy.findByTestId('voyageOptions')
        .children()
        .should('have.length', 3);
      cy.get('input[name="no"]').should('have.value', shipmentNo);
      cy.get('input[name="cargoReady.date"]').should('have.value', cargoReadyDateMoment);
    });
  });
});
