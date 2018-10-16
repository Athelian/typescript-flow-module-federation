const WAREHOUSE = {
  name: 'test name',
  updatedName: '[updated] test name',
  clonedName: '[cloned] [updated] test name',
  street: 'test street',
  locality: 'test locality',
  region: 'test region',
  postalCode: '123456',
  country: 'China',
  surface: '200',
};
describe('Warehouse', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('new a warehouse', () => {
    cy.visit('/warehouse/new');

    cy.get('input[name="name"]')
      .type(WAREHOUSE.name)
      .should('have.value', WAREHOUSE.name);
    cy.get('input[name="street"]')
      .type(WAREHOUSE.street)
      .should('have.value', WAREHOUSE.street);
    cy.get('input[name="locality"]')
      .type(WAREHOUSE.locality)
      .should('have.value', WAREHOUSE.locality);
    cy.get('input[name="region"]')
      .type(WAREHOUSE.region)
      .should('have.value', WAREHOUSE.region);
    cy.get('input[name="postalCode"]')
      .type(WAREHOUSE.postalCode)
      .should('have.value', WAREHOUSE.postalCode);
    // TODO: downshift cypress: https://github.com/paypal/downshift/blob/master/cypress/integration/combobox.js
    // cy.get('input[name="country"]')
    //   .type(WAREHOUSE.country)
    //   .should('have.value', WAREHOUSE.country);
    cy.get('input[name="surface"]')
      .type(WAREHOUSE.surface)
      .blur()
      .get('input[name="surface"]')
      .should('have.value', WAREHOUSE.surface);

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');
  });
  it('update a warehouse', () => {
    cy.get('input[name="name"]')
      .clear()
      .blur();

    cy.getByTestId('saveButton').should('be.disabled');

    cy.get('input[name="name"]')
      .type(WAREHOUSE.updatedName)
      .get('input[name="name"]')
      .should('have.value', WAREHOUSE.updatedName)
      .blur();

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');
  });

  it('clone a warehouse', () => {
    cy.getByTestId('cloneButton').click();
    cy.url().should('include', 'clone');
    cy.wait(500);
    cy.get('input[name="name"]').should('have.value', WAREHOUSE.clonedName);

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');
  });
});
