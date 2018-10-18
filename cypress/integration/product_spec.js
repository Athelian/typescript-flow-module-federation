import Chance from 'chance';

const chance = new Chance();

const PRODUCT = {
  name: 'e2e-test',
  updatedName: '[updated] e2e-test',
  clonedName: '[cloned] e2e-test',
  serial: chance.string({ length: 8 }),
  janCode: chance.string({ length: 13 }),
  hsCode: chance.string({ length: 10 }),
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
    cy.getByTestId('saveButton')
      .click()
      .wait(500);

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

  it('update a product', () => {
    cy.get('input[name="name"]')
      .clear()
      .blur();
    cy.getByTestId('saveButton').should('be.disabled');

    cy.get('input[name="name"]')
      .type(PRODUCT.updatedName)
      .blur();
    cy.getByTestId('saveButton')
      .click()
      .wait(500);

    cy.get('input[name="name"]')
      .should('have.value', PRODUCT.updatedName)
      .get('input[name="serial"]')
      .should('have.value', `${PRODUCT.serial}`)
      .get('input[name="janCode"]')
      .should('have.value', `${PRODUCT.janCode}`)
      .get('input[name="hsCode"]')
      .should('have.value', `${PRODUCT.hsCode}`)
      .get('input[name="material"]')
      .should('have.value', PRODUCT.material);
  });

  it('clone a product', () => {
    const serial = chance.string({ length: 8 });
    const janCode = chance.string({ length: 13 });
    const hsCode = chance.string({ length: 10 });

    cy.getByTestId('cloneButton')
      .click()
      .wait(500);
    cy.url().should('include', 'clone');

    cy.get('input[name="name"]')
      .clear()
      .type(PRODUCT.clonedName)
      .get('input[name="serial"]')
      .clear()
      .type(serial)
      .get('input[name="janCode"]')
      .clear()
      .type(janCode)
      .get('input[name="hsCode"]')
      .clear()
      .type(hsCode)
      .blur();

    cy.getByTestId('saveButton')
      .click()
      .wait(500);

    cy.get('input[name="name"]')
      .should('have.value', PRODUCT.clonedName)
      .get('input[name="serial"]')
      .should('have.value', `${serial}`)
      .get('input[name="janCode"]')
      .should('have.value', `${janCode}`)
      .get('input[name="hsCode"]')
      .should('have.value', `${hsCode}`)
      .get('input[name="material"]')
      .should('have.value', PRODUCT.material);
  });

  it('archive a product', () => {
    cy.getByTestId('archivedStatusToggle').click();
    cy.get('#dialog-root')
      .children()
      .should('have.length', 1);
    cy.getByTestId('archiveButton')
      .click()
      .wait(500);
    cy.get('svg[data-icon="toggle-off"]').should('be.exist');
  });

  it('activate a product', () => {
    cy.getByTestId('archivedStatusToggle').click();
    cy.get('#dialog-root')
      .children()
      .should('have.length', 1);
    cy.getByTestId('activeButton')
      .click()
      .wait(500);
    cy.get('svg[data-icon="toggle-on"]').should('be.exist');
  });
});
