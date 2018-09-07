// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { set, unset } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeTypename, flatten } from 'utils/data';
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
    const newState = set(this.state, path, value);
    this.setState(newState);
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      unset(prevState, path);
      return prevState;
    });
  };

  isDirty = (values: any) => !isEquals(values, this.originalValues);

  onSuccess = () => {
    logger.warn('onSuccess');
    this.originalValues = this.state;
  };

  initDetailValues = (values: any) => {
    // $FlowFixMe: missing type define for map's ramda function
    const { packageGrossWeight, packageVolume, packageSize, ...rest } = removeTypename(values);
    const flattenedValues = {
      ...rest,
      ...flatten({ packageGrossWeight, packageVolume, packageSize }),
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
