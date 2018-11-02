describe('Shipment', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('new a shipment', () => {
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
        .getByTestId('selectBatchesButton')
        .click()
        .wait(1000)
        .get('.InfiniteScroll')
        .children()
        .first()
        .click()
        .get('button[data-testid="saveButtonOnSelectBatches"]')
        .click()
        .wait(1000)
        .getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      cy.get('input[name="no"]').should('have.value', shipmentNo);
    });
  });

  it('update a shipment', () => {
    cy.visit('/shipment')
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);
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
        .wait(500)
        .blur()
        .getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      // Verify the input value is correct after saving
      cy.get('input[name="blDate"]')
        .should('have.value', date)
        .get('input[aria-labelledby="incotermSearchSelectInput"]')
        .should('have.value', incoterm);
    });
  });

  it('update timeline', () => {
    cy.visit('/shipment')
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .wait(1000);
    cy.url().should('include', '/shipment/emV');

    cy.task('fixture', 'shipment').then(({ cargoReadyDate }) => {
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

      cy.getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      // Verify
      cy.get('input[name="cargoReady.date"]').should('have.value', cargoReadyDateMoment);
    });
  });
});
