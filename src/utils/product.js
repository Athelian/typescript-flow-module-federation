// @flow
import { initValues as infoInitValues } from 'modules/productProvider/form/containers/info';
import { initValues as taskInitValues } from 'modules/productProvider/form/containers/tasks';
import { injectUid } from './id';

const generateEndProduct = () => injectUid({ ...infoInitValues, ...taskInitValues });

export default generateEndProduct;
