// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';

type FormState = {
  orderItems: Array<any>,
  files: Array<any>,
};

export default class OrderFormContainer extends Container<FormState> {
  state = {
    orderItems: [],
    files: [],
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = (values: any) => !isEquals(values, this.state);

  validationRules = () =>
    Yup.object().shape({
      poNo: Yup.string().required(),
      currency: Yup.string().required(),
      exporter: Yup.string().required(),
    });
}
