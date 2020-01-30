// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';
import { defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';

type ShipmentInfoType = {
  followers: Array<{ id: string, firstName: string, lastName: string }>,
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
  importer: ?{ id: string, name: string },
  forwarders: Array<{ id: string, name: string }>,
  exporter: ?{ id: string, name: string },
  totalPackageQuantityOverride: number,
  totalPackageQuantityOverriding: boolean,
  totalVolumeOverride: Object,
  totalVolumeOverriding: boolean,
  totalWeightOverride: Object,
  totalWeightOverriding: boolean,
};

const initValues = {
  followers: [],
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
  importer: null,
  forwarders: [],
  exporter: null,
  totalPackageQuantityOverride: 0,
  totalPackageQuantityOverriding: true,
  totalVolumeOverride: { value: 0, metric: defaultVolumeMetric },
  totalVolumeOverriding: true,
  totalWeightOverride: { value: 0, metric: defaultWeightMetric },
  totalWeightOverriding: true,
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
