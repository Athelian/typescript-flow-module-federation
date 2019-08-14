// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals, getByPath } from 'utils/fp';

type FormState = {
  archived?: boolean,
  piNo: ?string,
  poNo: ?string,
  currency: ?string,
  deliveryPlace: ?string,
  importer?: Object,
  exporter?: { id: string, name: string },
  incoterm: ?string,
  issuedAt: ?Date,
  deliveryDate: ?Date,
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
  deliveryDate: null,
  memo: null,
  shipments: [],
  containers: [],
  inCharges: [],
  customFields: {
    mask: null,
    fieldValues: [],
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
    this.originalValues = { ...parsedValues };
  };

  changeExporter = (prevExporter: Object) => {
    this.setState(state => {
      const { inCharges } = state;
      return {
        inCharges: inCharges.filter(
          user => getByPath('organization.id', user) !== getByPath('id', prevExporter)
        ),
      };
    });
  };
}
