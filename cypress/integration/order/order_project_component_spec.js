describe('Order > project component', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('select a milestone, and save', () => {
    cy.visit('/order')
      .get('.InfiniteScroll')
      .children()
      .first()
      .click();

    cy.contains('DOCUMENTS')
      .click()
      .get('[data-testid="btnSelectMilestone"]')
      .click()
      .get('.InfiniteScroll')
      .children()
      .first()
      .click()
      .get('.InfiniteScroll')
      .eq(1)
      .children()
      .first()
      .click()
      .get('[data-testid="btnSaveSelectMilestone"]')
      .click()
      .get('[data-testid="btnSaveSelectProjectAndMilestone"]')
      .click();
    cy.contains('ADD ALL TASKS').click();
    cy.get('[data-testid="btnSaveOrder"]').click();
  });
});
