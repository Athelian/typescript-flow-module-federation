// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  no?: string,
  blNo?: string,
  blDate?: Date,
  bookingNo?: string,
  bookingDate?: Date,
  invoiceNo?: string,
  loadType?: string,
  incoterm?: string,
  carrier?: string,
  forwarders: Array<{ id: string, name: string }>,
};

const initValues = {
  forwarders: [],
};

export default class ShipmentInfoContainer extends Container<FormState> {
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
    // $FlowFixMe: missing type for ramda's map function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
