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
const fetch = require('node-fetch');
const logger = require('loglevel');
const faker = require('faker');
const chance = require('chance').Chance();
const config = require('../../cypress.json');
const user = require('../fixtures/user.json');

module.exports = on => {
  on('task', {
    token: () => {
      const loginOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation ($input: CredentialsInput!) {
          login(input: $input) {
            token {
              token
            }
          }
        }`,
          variables: {
            input: {
              email: user.username,
              password: user.password,
            },
          },
        }),
      };

      return fetch(config.env.graphql, loginOptions).then(res => res.json());
    },
    me: token => {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `{
              viewer {
                user {
                  id
                  email
                  language
                }
              }
            }`,
        }),
      };
      return fetch(config.env.graphql, options).then(res => res.json());
    },
    language: ({ token, variables }) => {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation ChangeUserLanguage($id: ID!, $input: UserUpdateInput!) {
            userUpdate(id: $id, input: $input) {
              user {
                id
                language
              }
            }
          },
        `,
          variables,
        }),
      };
      return fetch(config.env.graphql, options).then(res => res.json());
    },
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

      if (type === 'batch')
        return {
          batchNo: faker.random.word(),
          quantity: faker.random.number(100),
          batchAdjustmentsQuantity: faker.random.number(100),
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

      if (type === 'shipment')
        return {
          shipmentNo: faker.name.findName(),
          blDate: faker.date.future(),
          incoterm: 'DAT',
          cargoReadyDate: faker.date.future(),
        };

      if (type === 'warehouse')
        return {
          name: faker.name.findName(),
          updatedName: faker.name.findName(),
          clonedName: faker.name.findName(),
          street: faker.address.streetAddress(),
          locality: 'test locality',
          region: faker.address.state(),
          postalCode: faker.address.zipCode(),
          country: faker.address.country(),
          surface: faker.random.number(),
        };

      return null;
    },
    log(message) {
      logger.log(message);
      return null;
    },
  });
};
