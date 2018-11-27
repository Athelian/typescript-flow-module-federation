describe('Warehouse', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('new a warehouse', () => {
    cy.task('fixture', 'warehouse').then(
      ({ name, street, locality, region, postalCode, country, surface }) => {
        cy.visit('/warehouse/new');

        cy.get('input[name="name"]')
          .type(name)
          .should('have.value', name);
        cy.get('input[name="street"]')
          .type(street)
          .should('have.value', street);
        cy.get('input[name="locality"]')
          .type(locality)
          .should('have.value', locality);
        cy.get('input[name="region"]')
          .type(region)
          .should('have.value', region);
        cy.get('input[name="postalCode"]')
          .type(postalCode)
          .should('have.value', postalCode)
          .get('input[aria-labelledby="countrySearchSelectInput"]')
          .type(country)
          .should('have.value', country)
          .wait(500)
          .get('input[name="surface"]')
          .type(surface)
          .blur()
          .get('input[name="surface"]')
          .should('have.value', `${surface}`);

        cy.getByTestId('saveButton')
          .click()
          .wait(1000)
          .should('not.exist');

        cy.get('input[name="name"]')
          .should('have.value', name)
          .get('input[name="street"]')
          .should('have.value', street)
          .get('input[name="locality"]')
          .should('have.value', locality)
          .get('input[name="region"]')
          .should('have.value', region)
          .get('input[name="postalCode"]')
          .should('have.value', postalCode);
      }
    );
  });

  it('update a warehouse', () => {
    cy.task('fixture', 'warehouse').then(({ updatedName }) => {
      cy.get('input[name="name"]')
        .clear()
        .blur();

      cy.getByTestId('saveButton').should('be.disabled');

      cy.get('input[name="name"]')
        .type(updatedName)
        .get('input[name="name"]')
        .should('have.value', updatedName)
        .blur();

      cy.getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');
    });
  });

  it('clone a warehouse', () => {
    cy.task('fixture', 'warehouse').then(({ clonedName }) => {
      cy.getByTestId('cloneButton').click();
      cy.url().should('include', 'clone');
      cy.wait(1000);
      cy.get('input[name="name"]')
        .clear()
        .type(clonedName)
        .blur();

      cy.getByTestId('saveButton')
        .click()
        .wait(1000)
        .should('not.exist');
    });
  });
});
