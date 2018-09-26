// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
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
};

const initValues = {
  shipments: [],
};

export default class OrderInfoContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: clean up this later
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
