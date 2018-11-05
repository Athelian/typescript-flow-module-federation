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
  {
    name: 'issuedAt',
    type: 'date',
  },
  {
    name: 'currency',
    type: 'enum',
  },
  {
    name: 'incoterm',
    type: 'enum',
  },
  {
    name: 'deliveryPlace',
    type: 'text',
  },
  {
    name: 'memo',
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
