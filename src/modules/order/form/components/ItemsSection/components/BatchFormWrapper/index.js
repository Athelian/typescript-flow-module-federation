// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { isDataType } from 'utils/fp';
import BatchFormContainer from 'modules/batch/form/container';
import BatchForm from 'modules/batch/form';
import { FormContainer } from 'modules/form';

type Props = {
  batch: Object,
  orderItem: Object,
  isNew: boolean,
  initDetailValues: Function,
};

const formContainer = new FormContainer();

class BatchFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { batch, orderItem, initDetailValues } = this.props;
    const { deliveredAt, ...rest } = batch;
    initDetailValues({
      ...rest,
      orderItem,
      deliveredAt: isDataType(String, deliveredAt)
        ? deliveredAt
        : deliveredAt && deliveredAt.toISOString(),
    });
  }

  render() {
    const { isNew } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[BatchFormContainer]}>
          {({ state }) => (
            <BatchForm
              key={`${state.id}-${state.no}-${state.quantity}-${state.deliveredAt}`}
              batch={state}
              isNew={isNew}
              selectable={false}
            />
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default BatchFormWrapper;
