import randomcolor from 'randomcolor';
import faker from 'faker';

const TAG = {
  name: faker.name.findName(),
  updatedName: faker.name.findName(),
  clonedName: faker.name.findName(),
  description: faker.lorem.sentence(),
  color: randomcolor(),
};

describe('Tag', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('new a tag', () => {
    cy.visit('/tags')
      .findByTestId('newButton')
      .click();

    cy.url().should('include', 'new');

    cy.get('input[name="name"]').type(TAG.name);
    cy.get('textarea[name="description"]').type(TAG.description);
    cy.get('input[name="color"]')
      .clear()
      .type(TAG.color);
    cy.findByTestId('orderRadio').click();

    cy.findByTestId('saveButton')
      .click()
      .should('not.exist');

    cy.get('input[name="name"]')
      .should('have.value', TAG.name)
      .get('textarea[name="description"]')
      .should('have.value', TAG.description)
      .get('input[name="color"]')
      .should('have.value', TAG.color);
  });

  it('update a tag', () => {
    cy.get('input[name="name"]')
      .clear()
      .blur();
    cy.findByTestId('saveButton').should('be.disabled');
    cy.get('input[name="name"]')
      .type(TAG.updatedName)
      .blur();

    cy.findByTestId('saveButton')
      .click()
      .should('not.exist');
  });

  it('clone a tag', () => {
    cy.findByTestId('cloneButton').click();
    cy.url().should('include', 'clone');
    cy.get('input[name="name"]')
      .clear()
      .type(TAG.clonedName)
      .blur();

    cy.findByTestId('saveButton')
      .click()
      .should('not.exist');
  });
});
