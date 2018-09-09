// @flow
import { Container } from 'unstated';
import { setIn, isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type FormState = {
  orderItems: Array<Object>,
};

const initValues = {
  orderItems: [],
};

export default class OrderItemsContainer extends Container<FormState> {
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

  setFieldArrayValue = (name: string, index: number, value: any) => {
    this.setState(prevState => {
      const values = prevState[name];
      let existValue = values[index];
      Object.keys(value).forEach(path => {
        existValue = setIn(path, value[path], existValue);
      });

      values.splice(index, 1, existValue);
      return {
        [name]: values,
      };
    });
  };

  initDetailValues = (orderItems: Array<Object>) => {
    const parsedValues: Array<any> = removeTypename(orderItems);
    this.setState({
      orderItems: parsedValues,
    });
    this.originalValues = parsedValues;
  };
}
