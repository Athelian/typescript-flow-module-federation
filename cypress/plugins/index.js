// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const logger = require('loglevel');
const faker = require('faker');

module.exports = on => {
  on('task', {
    fixture: type => {
      logger.log('create fixture', type);
      if (type === 'order')
        return {
          poNo: faker.name.findName(),
          piNo: faker.name.findName(),
          issueAt: faker.date.future(),
          deliveryPlace: faker.address.city(),
          memo: faker.lorem.paragraph(),
          currency: 'ALL',
          incoterm: 'FAS',
        };

      return null;
    },
    log(message) {
      logger.log(message);
      return null;
    },
  });
};
