const chance = require('chance').Chance();

const PRODUCT = {
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

module.exports = PRODUCT;
