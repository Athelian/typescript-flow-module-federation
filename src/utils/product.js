// @flow
import { injectUid } from './id';

const generateEndProduct = () =>
  injectUid({
    unitVolume: {
      value: 0,
      metric: 'm³',
    },
    unitSize: {
      width: {
        value: 0,
        metric: 'cm',
      },
      height: {
        value: 0,
        metric: 'cm',
      },
      length: {
        value: 0,
        metric: 'cm',
      },
    },
    unitWeight: {
      value: 0,
      metric: 'kg',
    },
    unitPrice: {
      amount: 0,
      currency: 'JPY',
    },
    inspectionFee: {
      amount: 0,
      currency: 'JPY',
    },
    packageGrossWeight: {
      value: 0,
      metric: 'kg',
    },
    packageVolume: {
      value: 0,
      metric: 'm³',
    },
    packageSize: {
      width: {
        value: 0,
        metric: 'cm',
      },
      height: {
        value: 0,
        metric: 'cm',
      },
      length: {
        value: 0,
        metric: 'cm',
      },
    },
    files: [],
  });

export default generateEndProduct;
