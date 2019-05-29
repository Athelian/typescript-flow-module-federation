describe('Product', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('new a product', () => {
    cy.task('fixture', 'product').then(
      ({ name, serial, janCode, hsCode, material, endProductName }) => {
        cy.visit('/product')
          .getByTestId('newButton')
          .click()
          .url()
          .should('include', 'new');

        // required fields
        cy.get('input[name="name"]')
          .type(name)
          .get('input[name="serial"]')
          .type(serial);

        cy.get('input[name="janCode"]')
          .type(janCode)
          .get('input[name="hsCode"]')
          .type(hsCode)
          .get('input[name="material"]')
          .type(material);

        // end product
        cy.getByTestId('newProviderButton')
          .click()
          .getByTestId('selectExportersButton')
          .click()
          .get('[data-testid="partnerCard"]')
          .first()
          .click()
          .getByTestId('saveButtonOnSelectExporters')
          .click();

        cy.get('input[name="name"]')
          .eq(1)
          .type(endProductName)
          .blur();

        cy.getByTestId('saveProviderButton').click();

        cy.getByTestId('saveButton')
          .click()
          .wait(1000);

        cy.url().should('include', '/product/emV');

        cy.get('input[name="name"]')
          .should('have.value', name)
          .get('input[name="serial"]')
          .should('have.value', serial)
          .get('input[name="janCode"]')
          .should('have.value', janCode)
          .get('input[name="hsCode"]')
          .should('have.value', hsCode)
          .get('input[name="material"]')
          .should('have.value', material);
      }
    );
  });

  it('update a product', () => {
    cy.task('fixture', 'product').then(({ updatedName }) => {
      cy.get('input[name="name"]')
        .clear()
        .blur();
      cy.getByTestId('saveButton').should('be.disabled');

      cy.get('input[name="name"]')
        .type(updatedName)
        .blur();
      cy.getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');

      cy.get('input[name="name"]').should('have.value', updatedName);
    });
  });

  it('clone a product', () => {
    cy.task('fixture', 'product').then(
      ({ clonedName, clonedSerial, clonedJanCode, clonedHsCode, material }) => {
        cy.getByTestId('cloneButton')
          .click()
          .wait(1000);

        cy.url().should('include', 'clone');

        cy.get('input[name="name"]')
          .clear()
          .type(clonedName)
          .get('input[name="serial"]')
          .clear()
          .type(clonedSerial)
          .get('input[name="janCode"]')
          .clear()
          .type(clonedJanCode)
          .get('input[name="hsCode"]')
          .clear()
          .type(clonedHsCode)
          .get('input[name="material"]')
          .clear()
          .type(material)
          .blur();

        cy.getByTestId('saveButton')
          .click()
          .wait(1000);

        cy.url().should('include', '/product/emV');

        cy.get('input[name="name"]')
          .should('have.value', clonedName)
          .get('input[name="serial"]')
          .should('have.value', clonedSerial)
          .get('input[name="janCode"]')
          .should('have.value', clonedJanCode)
          .get('input[name="hsCode"]')
          .should('have.value', clonedHsCode)
          .get('input[name="material"]')
          .should('have.value', material);
      }
    );
  });

  it('archive a product', () => {
    cy.getByTestId('archivedStatusToggle').click();
    cy.get('#dialog-root')
      .children()
      .should('have.length', 1);
    cy.getByTestId('archiveButton')
      .click()
      .wait(1000);
    cy.get('svg[data-icon="toggle-off"]').should('be.exist');
  });

  it('activate a product', () => {
    cy.getByTestId('archivedStatusToggle').click();
    cy.get('#dialog-root')
      .children()
      .should('have.length', 1);
    cy.getByTestId('activeButton')
      .click()
      .wait(1000);
    cy.get('svg[data-icon="toggle-on"]').should('be.exist');
  });
});
