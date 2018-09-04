// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import { removeTypename } from 'utils/data';

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

  isDirty = (values: any) => !isEquals(values, this.batch);

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(values);
    /* $FlowFixMe Kaka will fix with magic */
    this.setState(parsedValues);
    this.batch = parsedValues;

    logger.warn('setValues for batch detail', parsedValues);
    logger.warn('batch detail', this.batch);
  };

  validationRules = () =>
    Yup.object().shape({
      no: Yup.string().required(),
      orderItem: Yup.string().required(),
      quantity: Yup.number().required(),
    });
}
