// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import BatchForm from 'modules/batch/form';

type Props = {
  batch: Object,
  orderItem: Object,
  isNew: boolean,
  initDetailValues: Function,
};

class BatchFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { batch, orderItem, initDetailValues } = this.props;
    initDetailValues({
      ...batch,
      orderItem,
    });
  }

  render() {
    const { isNew } = this.props;
    return (
      <Subscribe to={[BatchFormContainer]}>
        {({ state }) => (
          <BatchForm
            key={`${state.id}-${state.no}-${state.quantity}-${state.deliveredAt}`}
            batch={state}
            isNew={isNew}
          />
        )}
      </Subscribe>
    );
  }
}

export default BatchFormWrapper;
