// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';

type FormState = {
  batchAdjustments: Array<any>,
};

export default class BatchFormContainer extends Container<FormState> {
  state = {
    batchAdjustments: [],
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = (values: any) => !isEquals(values, this.state);

  validationRules = () =>
    Yup.object().shape({
      no: Yup.string().required(),
      orderItem: Yup.string().required(),
      quantity: Yup.number().required(),
    });
}
