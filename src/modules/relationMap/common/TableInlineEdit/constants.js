// @flow
export const orderColumnFields = [
  {
    name: 'poNo',
    type: 'text',
  },
  {
    name: 'piNo',
    type: 'text',
  },
];

export const orderItemColumnFields = [
  {
    name: 'productProvider.product.name',
    type: 'text',
  },
  {
    name: 'productProvider.product.serial',
    type: 'text',
  },
];

export const batchColumnFields = [
  {
    name: 'no',
    type: 'text',
  },
  {
    name: 'quantity',
    type: 'number',
  },
];

export const shipmentColumnFields = [
  {
    name: 'no',
    type: 'text',
  },
  {
    name: 'blNo',
    type: 'text',
  },
];
