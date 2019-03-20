// @flow
import { Container } from 'unstated';
import { cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  archived?: boolean,
  piNo?: string,
  poNo?: string,
  currency?: string,
  deliveryPlace?: string,
  exporter?: { id: string, name: string },
  incoterm?: string,
  issuedAt?: Date,
  memo?: string,
  shipments: Array<Object>,
  inCharges: Array<Object>,
  customFields: Object,
};

const initValues = {
  currency: 'USD',
  shipments: [],
  inCharges: [],
  customFields: {
    fieldValues: [],
    fieldDefinitions: [],
  },
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
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
