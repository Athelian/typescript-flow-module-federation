// @flow
import { Container } from 'unstated';
import type { OrderItem } from 'generated/graphql';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { extractForbiddenId, cleanFalsyAndTypeName } from 'utils/data';

export const initValues: OrderItem = {
  no: null,
  quantity: 0,
  price: {
    currency: 'USD',
    amount: 0,
  },
  deliveryDate: null,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  tags: [],
  followers: [],
  memo: null,
  productProvider: null,
  order: null,
};

export default class OrderItemInfoContainer extends Container<OrderItem> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    const parsedTags = [...parsedValues.tags.map(tag => extractForbiddenId(tag))];
    this.setState({ ...parsedValues, tags: parsedTags });
    this.originalValues = { ...parsedValues, tags: parsedTags };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };
}
