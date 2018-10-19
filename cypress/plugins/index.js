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
const chance = require('chance').Chance();

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

      if (type === 'product')
        return {
          name: 'e2e-test',
          updatedName: '[updated] e2e-test',
          clonedName: '[cloned] e2e-test',
          serial: chance.string({ length: 8 }),
          clonedSerial: chance.string({ length: 8 }),
          janCode: chance.string({ length: 13 }),
          clonedJanCode: chance.string({ length: 13 }),
          hsCode: chance.string({ length: 10 }),
          clonedHsCode: chance.string({ length: 10 }),
          material: 'e2e-material',
          tags: [],
        };

      return null;
    },
    log(message) {
      logger.log(message);
      return null;
    },
  });
};
