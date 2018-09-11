// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchForm from 'modules/batch/form';
import BatchFormContainer from 'modules/batch/form/container';
import { OrderItemsContainer } from 'modules/order/form/containers';
import LoadingIcon from 'components/LoadingIcon';

type Props = {
  orderIndex: number,
  batchIndex: number,
  isNew: boolean,
};

type State = {
  isMounted: boolean,
};

class BatchFormWrapper extends React.PureComponent<Props, State> {
  state = {
    isMounted: false,
  };

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  render() {
    const { orderIndex, batchIndex, isNew } = this.props;
    const { isMounted } = this.state;
    return (
      <Subscribe to={[BatchFormContainer, OrderItemsContainer]}>
        {({ state, initDetailValues }, { state: { orderItems } }) =>
          !isMounted ? (
            (() => {
              initDetailValues(orderItems[orderIndex].batches[batchIndex]);
              return <LoadingIcon />;
            })()
          ) : (
            <BatchForm batch={state} isNew={isNew} />
          )
        }
      </Subscribe>
    );
  }
}

export default BatchFormWrapper;
