// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename, removeNulls, flatten } from 'utils/data';
import logger from 'utils/logger';

type FormState = {
  batchAdjustments: Array<any>,
};

const initValues = {
  batchAdjustments: [],
};

export default class BatchFormContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      // $FlowFixMe: missing type define for map's ramda function
      return removeNulls(cloneState);
    });
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    logger.warn('onSuccess');
    this.originalValues = this.state;
  };

  initDetailValues = (values: any) => {
    logger.warn('onInitDetailValues');
    // $FlowFixMe: missing type define for map's ramda function
    const { packageGrossWeight, packageVolume, packageSize, ...rest } = removeTypename(values);
    const flattenedValues = {
      ...rest,
      ...flatten({
        packageGrossWeight: packageGrossWeight || { value: 0, metric: 'kg' },
        packageVolume: packageVolume || {
          metric: 'cm³',
          value: 0,
        },
        packageSize: packageSize || {
          width: {
            metric: 'cm',
            value: 0,
          },
          height: {
            metric: 'cm',
            value: 0,
          },
          length: {
            metric: 'cm',
            value: 0,
          },
        },
      }),
    };
    this.setState(flattenedValues);
    this.originalValues = flattenedValues;
  };

  validationRules = () =>
    Yup.object().shape({
      no: Yup.string().required(),
      orderItem: Yup.string().required(),
      quantity: Yup.number().required(),
    });
}
