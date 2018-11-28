// @flow
import { Container } from 'unstated';
import { cleanUpData, cleanFalsy } from 'utils/data';
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
  customFields: Object,
  forwarders: Array<{ id: string, name: string }>,
  inCharges: Array<{ id: string, firstName: string, lastName: string }>,
};

const initValues = {
  forwarders: [],
  inCharges: [],
  customFields: {
    mask: null,
    fieldValues: [],
    fieldDefinitions: [],
  },
};

export default class ShipmentInfoContainer extends Container<FormState> {
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
