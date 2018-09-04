// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';

type FormState = {
  batchAdjustments: Array<any>,
};

const initValues = {
  batchAdjustments: [],
};

export default class BatchFormContainer extends Container<FormState> {
  state = initValues;

  batch = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = (values: any) => !isEquals(values, this.state);

  initDetailValues = (values: any) => {
    this.setState(values);
    this.batch = values;

    logger.warn('setValues for batch detail', values);
    logger.warn('batch detail', this.batch);
  };

  validationRules = () =>
    Yup.object().shape({
      no: Yup.string().required(),
      orderItem: Yup.string().required(),
      quantity: Yup.number().required(),
    });
}
