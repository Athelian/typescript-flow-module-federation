// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';

type FormState = {
  transportType?: string,
};

const initValues = {};

export default class ShipmentTransportTypeContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (transportType: string) => {
    this.setState({ transportType });
    this.originalValues = { transportType };
  };
}
