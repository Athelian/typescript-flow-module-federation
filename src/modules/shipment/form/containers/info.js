// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type ShipmentInfoType = {
  no: ?string,
  blNo: ?string,
  blDate: ?Date,
  bookingNo: ?string,
  booked: boolean,
  bookingDate: ?Date,
  invoiceNo: ?string,
  contractNo: ?string,
  loadType: ?string,
  incoterm: ?string,
  carrier: ?string,
  customFields: Object,
  memo: ?string,
  inCharges: Array<{ id: string, firstName: string, lastName: string }>,
  importer: ?{ id: string, name: string },
  forwarders: Array<{ id: string, name: string }>,
  exporter: ?{ id: string, name: string },
  totalPackageQuantityOverride: number,
  totalPackageQuantityOverriding: boolean,
};

const initValues = {
  no: null,
  blNo: null,
  blDate: null,
  bookingNo: null,
  booked: false,
  bookingDate: null,
  invoiceNo: null,
  contractNo: null,
  loadType: null,
  incoterm: null,
  carrier: null,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  memo: null,
  inCharges: [],
  importer: null,
  forwarders: [],
  exporter: null,
};

export default class ShipmentInfoContainer extends Container<ShipmentInfoType> {
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

  setFieldValues = (values: Object) => {
    this.setState(values);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
