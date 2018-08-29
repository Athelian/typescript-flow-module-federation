// @flow
import * as React from 'react';
import logger from 'utils/logger';
import { isEquals } from 'utils/fp';
import type { OrderForm as FormState } from '../type.js.flow';

const defaultState = {
  isReady: false,
  formData: {
    orderItems: [],
    files: [],
  },
  onChange: () => {},
  onFinish: () => {},
  isDirty: values => !values,
};

const OrderFormContext = React.createContext(defaultState);

type Props = {
  children: React.Node,
};

type State = {
  isReady: boolean,
  formData: FormState,
  onChange: Function,
  onFinish: Function,
  isDirty: Function,
};

class OrderFormProvider extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const onChange = async (data: {
      observeValues: Object,
      onValidate: (values: Object) => Promise<Object>,
    }) => {
      const { observeValues, onValidate } = data;
      logger.warn('observeValues', observeValues);
      const { exporter, updatedAt, ...rest } = observeValues;
      try {
        await onValidate(observeValues);
        this.setState(prevState => ({
          isReady: true,
          formData: { ...prevState.formData, ...rest, exporterId: exporter.id },
        }));
      } catch (errors) {
        logger.warn('errors', errors);
        this.setState(prevState => ({
          isReady: false,
          formData: { ...prevState.formData, ...rest, exporterId: exporter && exporter.id },
        }));
      }
    };

    const isDirty = initValues => {
      const { formData } = this.state;
      return !isEquals(formData, initValues);
    };

    const onFinish = () => this.setState(() => ({ isReady: false }));

    this.state = {
      ...defaultState,
      /* eslint-disable react/no-unused-state */
      onChange,
      onFinish,
      isDirty,
    };
  }

  render() {
    const { children } = this.props;
    return <OrderFormContext.Provider value={this.state}>{children}</OrderFormContext.Provider>;
  }
}

export const OrderFormConsumer = OrderFormContext.Consumer;

export default OrderFormProvider;
