// @flow
import { Container } from 'unstated';

export type ForgotPasswordFormState = {
  email?: string,
};

const initValues = {};

export default class ForgotPasswordFormContainer extends Container<ForgotPasswordFormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = () => Object.keys(this.state).length > 0;

  onSuccess = () => {
    this.setState(initValues);
  };
}
