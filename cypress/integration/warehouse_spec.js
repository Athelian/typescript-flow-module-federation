describe('Warehouse', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('new a warehouse', () => {
    const formContent = {
      name: 'test name',
      street: 'test street',
      locality: 'test locality',
      region: 'test region',
      postalCode: '123456',
      country: 'China',
      surface: '200',
    };

    cy.visit('/warehouse/new');

    cy.get('input[name="name"]')
      .type(formContent.name)
      .should('have.value', formContent.name);
    cy.get('input[name="street"]')
      .type(formContent.street)
      .should('have.value', formContent.street);
    cy.get('input[name="locality"]')
      .type(formContent.locality)
      .should('have.value', formContent.locality);
    cy.get('input[name="region"]')
      .type(formContent.region)
      .should('have.value', formContent.region);
    cy.get('input[name="postalCode"]')
      .type(formContent.postalCode)
      .should('have.value', formContent.postalCode);
    // TODO: downshift cypress: https://github.com/paypal/downshift/blob/master/cypress/integration/combobox.js
    // cy.get('input[name="country"]')
    //   .type(formContent.country)
    //   .should('have.value', formContent.country);
    cy.get('input[name="surface"]')
      .type(formContent.surface)
      .blur()
      .get('input[name="surface"]')
      .should('have.value', formContent.surface);

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');
  });
});
