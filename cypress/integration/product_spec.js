const PRODUCT = {
  name: 'e2e-test',
  serial: parseInt(Math.random() * 1e8, 10), // TODO: random
  janCode: parseInt(Math.random() * 1e13, 10), // TODO: random
  hsCode: parseInt(Math.random() * 1e10, 10),
  material: 'e2e-material',
  tags: [],
};

describe('Product', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('new a product', () => {
    cy.visit('/product')
      .getByTestId('newButton')
      .click()
      .url()
      .should('include', 'new');

    cy.get('input[name="name"]')
      .type(PRODUCT.name)
      .get('input[name="serial"]')
      .type(PRODUCT.serial)
      .get('input[name="janCode"]')
      .type(PRODUCT.janCode)
      .get('input[name="hsCode"]')
      .type(PRODUCT.hsCode)
      .get('input[name="material"]')
      .type(PRODUCT.material);

    // cy.get('input[name="tag"]').type(PRODUCT.tags)
    cy.getByTestId('newProviderButton').click();
    cy.getByTestId('selectExportersButton').click();

    cy.getByTestId('partnerCard').click();
    cy.getByTestId('saveButtonOnSelectExporters').click();
    cy.getByTestId('saveProviderButton').click();
    cy.getByTestId('saveButton').click();

    cy.get('input[name="name"]')
      .should('have.value', PRODUCT.name)
      .get('input[name="serial"]')
      .should('have.value', `${PRODUCT.serial}`)
      .get('input[name="janCode"]')
      .should('have.value', `${PRODUCT.janCode}`)
      .get('input[name="hsCode"]')
      .should('have.value', `${PRODUCT.hsCode}`)
      .get('input[name="material"]')
      .should('have.value', PRODUCT.material);
  });
});
