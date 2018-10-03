// @flow
import { Container } from 'unstated';
import { cleanUpData, cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  archived?: boolean,
  currency?: string,
  deliveryPlace?: string,
  exporter?: { id: string, name: string },
  incoterm?: string,
  issuedAt?: Date,
  memo?: string,
  piNo?: string,
  poNo?: string,
  shipments: Array<Object>,
  inCharges: Array<Object>,
};

const initValues = {
  shipments: [],
  inCharges: [],
};

export default class OrderInfoContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = cleanUpData(values);
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
