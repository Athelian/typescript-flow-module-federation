// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  no?: string,
  blNo?: string,
  blDate?: Date,
  booked: boolean,
  bookingNo?: string,
  bookingDate?: Date,
  invoiceNo?: string,
  contractNo?: string,
  loadType?: string,
  incoterm?: string,
  carrier?: string,
  forwarders: Array<{ id: string, name: string }>,
  importer: { id: string, name: string },
  inCharges: Array<{ id: string, firstName: string, lastName: string }>,
  customFields: Object,
};

const initValues = {
  forwarders: [],
  importer: {},
  inCharges: [],
  booked: false,
  customFields: {
    fieldValues: [],
    fieldDefinitions: [],
  },
};

export default class ShipmentInfoContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

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
