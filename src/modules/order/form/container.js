// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';
import logger from 'utils/logger';

type FormState = {
  orderItems: Array<any>,
};

const initValues = {
  orderItems: [],
};

export default class OrderFormContainer extends Container<FormState> {
  state = initValues;

  order = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = (values: any) => !isEquals(values, this.order);

  initDetailValues = (values: Object) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe missing type for map function in ramda
    this.setState(parsedValues);
    this.order = parsedValues;

    logger.warn('setValues for order detail', values);
    logger.warn('order detail', this.order);
  };

  validationRules = () =>
    Yup.object().shape({
      poNo: Yup.string().required(),
      currency: Yup.string().required(),
      exporter: Yup.string().required(),
    });
}
