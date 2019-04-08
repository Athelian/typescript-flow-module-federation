// @flow
import React, { lazy, Suspense } from 'react';
import { navigate } from '@reach/router';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import LoadingIcon from 'components/LoadingIcon';
import { BatchFormWrapperStyle } from './style';

const AsyncBatchSection = lazy(() => import('./components/BatchSection'));
const AsyncQuantityAdjustmentsSection = lazy(() =>
  import('./components/QuantityAdjustmentsSection')
);
const AsyncPackagingSection = lazy(() => import('./components/PackagingSection'));
const AsyncShipmentSection = lazy(() => import('./components/ShipmentSection'));
const AsyncContainerSection = lazy(() => import('./components/ContainerSection'));
const AsyncOrderSection = lazy(() => import('./components/OrderSection'));
const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));

type OptionalProps = {
  isNew: boolean,
  isClone: boolean,
  orderItemIsReadonly: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
  orderItemIsReadonly: true,
  onFormReady: () => {},
};

export default class BatchForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { batch, orderItemIsReadonly, isNew } = this.props;

    return (
      !isEquals(batch, nextProps.batch) ||
      !isEquals(orderItemIsReadonly, nextProps.orderItemIsReadonly) ||
      !isEquals(isNew, nextProps.isNew)
    );
  }

  onClone = () => {
    const { batch } = this.props;
    navigate(`/batch/clone/${encodeId(batch.id)}`);
  };

  render() {
    const { batch, isNew, isClone, orderItemIsReadonly } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={BatchFormWrapperStyle}>
          <AsyncBatchSection
            isNew={isNew}
            isClone={isClone}
            orderItemIsReadonly={orderItemIsReadonly}
            batch={batch}
          />
          <AsyncQuantityAdjustmentsSection isNew={isNew} />
          <AsyncPackagingSection isNew={isNew} />
          <AsyncTaskSection type="batch" />
          <AsyncShipmentSection shipment={batch.shipment} />
          <AsyncContainerSection container={batch.container} />
          <AsyncOrderSection />
        </div>
      </Suspense>
    );
  }
}
