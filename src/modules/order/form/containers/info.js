// @flow
import type { Order } from 'generated/graphql';
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

const initValues: Order = {
  piNo: null,
  poNo: null,
  currency: 'USD',
  deliveryPlace: null,
  incoterm: null,
  issuedAt: null,
  deliveryDate: null,
  memo: null,
  followers: [],
  shipments: [],
  containers: [],
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

export default class OrderInfoContainer extends Container<Order> {
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

  changeExporter = (previousExporter: Object) => {
    this.setState(prevState => ({
      ...prevState,
      followers: prevState.followers?.filter(
        follower => follower?.organization?.id !== previousExporter?.id
      ),
    }));
  };
}
