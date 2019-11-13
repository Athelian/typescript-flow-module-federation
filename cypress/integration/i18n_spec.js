describe('I18n', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should show language on UI base on user setting', () => {
    cy.task('token').then(
      ({
        data: {
          login: { token },
        },
      }) => {
        cy.task('me', token).then(
          ({
            data: {
              viewer: { user },
            },
          }) => {
            cy.visit('/').contains(
              user.language === 'en' ? 'RELATIONAL MAP' : 'リレーションマップ'
            );
          }
        );
      }
    );
  });

  it('should change language', () => {
    cy.task('token').then(
      ({
        data: {
          login: { token },
        },
      }) => {
        cy.task('me', token).then(
          ({
            data: {
              viewer: { user },
            },
          }) => {
            cy.task('language', {
              token,
              variables: { id: user.id, input: { language: 'ja' } },
            }).then(() => {
              cy.visit('/').contains('リレーションマップ');
              cy.task('language', {
                token,
                variables: { id: user.id, input: { language: 'en' } },
              }).then(() => {
                cy.visit('/').contains('RELATIONAL MAP');
              });
            });
          }
        );
      }
    );
  });
});
