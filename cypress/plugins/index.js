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
            ... on Token {
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
                  ... on User {
                    id
                    email
                    language
                  }
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
              ... on User {
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
      switch (type) {
        case 'order':
          return {
            poNo: faker.name.findName(),
            piNo: faker.name.findName(),
            issueAt: faker.date.future(),
            deliveryPlace: faker.address.city(),
            memo: faker.lorem.paragraph(),
            currency: 'USD',
            incoterm: 'FAS',
          };

        case 'batch':
          return {
            batchNo: faker.random.word(),
            quantity: faker.random.number(100),
            batchAdjustmentsQuantity: faker.random.number(100),
          };

        case 'product':
          return {
            name: faker.name.findName(),
            updatedName: faker.name.findName(),
            clonedName: faker.name.findName(),
            serial: faker.lorem.slug(8).substr(0, 8),
            clonedSerial: faker.lorem.slug(8).substr(0, 8),
            janCode: faker.lorem.slug(13).substr(0, 13),
            clonedJanCode: faker.lorem.slug(13).substr(0, 13),
            hsCode: faker.lorem.slug(10).substr(0, 10),
            clonedHsCode: faker.lorem.slug(10).substr(0, 10),
            material: faker.name.findName(),
            tags: [],
            endProductName: faker.name.findName(),
          };

        case 'shipment':
          return {
            shipmentNo: faker.name.findName(),
            blDate: faker.date.future(),
            incoterm: 'DAT',
            cargoReadyDate: faker.date.future(),
          };
        case 'warehouse':
          return {
            name: faker.name.findName(),
            updatedName: faker.name.findName(),
            clonedName: faker.name.findName(),
            street: faker.address.streetAddress(),
            locality: faker.name.findName(),
            region: faker.address.state(),
            postalCode: faker.address.zipCode(),
            country: faker.address.country(),
            surface: faker.random.number(),
          };
        default:
          return null;
      }
    },
    log(message) {
      logger.log(message);
      return null;
    },
  });
};
