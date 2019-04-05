// @flow
import { initValues } from 'modules/productProvider/form/container';
import { injectUid } from './id';

const generateEndProduct = () => injectUid(initValues);

export default generateEndProduct;
