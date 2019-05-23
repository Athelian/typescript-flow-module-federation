// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  archived?: boolean,
  piNo: ?string,
  poNo: ?string,
  currency: ?string,
  deliveryPlace: ?string,
  exporter?: { id: string, name: string },
  incoterm: ?string,
  issuedAt: ?Date,
  memo: ?string,
  shipments: Array<Object>,
  containers: Array<Object>,
  inCharges: Array<Object>,
  customFields: Object,
  totalPrice: ?Object,
  totalOrdered: number,
  totalBatched: number,
  totalShipped: number,
  orderItemCount: number,
  batchCount: number,
  batchShippedCount: number,
  shipmentCount: number,
};

const initValues: FormState = {
  piNo: null,
  poNo: null,
  currency: 'USD',
  deliveryPlace: null,
  incoterm: null,
  issuedAt: null,
  memo: null,
  shipments: [],
  containers: [],
  inCharges: [],
  customFields: {
    fieldValues: [],
    fieldDefinitions: [],
  },
  totalPrice: null,
  totalOrdered: 0,
  totalBatched: 0,
  totalShipped: 0,
  orderItemCount: 0,
  batchCount: 0,
  batchShippedCount: 0,
  shipmentCount: 0,
};

export default class OrderInfoContainer extends Container<FormState> {
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
