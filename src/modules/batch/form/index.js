// @flow
import React, { lazy, Suspense } from 'react';
import { Subscribe } from 'unstated';
import { isEquals } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { BatchInfoContainer, BatchTasksContainer } from './containers';
import { BatchFormInSlideStyle } from './style';

const AsyncBatchSection = lazy(() => import('./components/BatchSection'));
const AsyncQuantitySection = lazy(() => import('./components/QuantitySection'));
const AsyncPackagingSection = lazy(() => import('./components/PackagingSection'));
const AsyncShipmentSection = lazy(() => import('./components/ShipmentSection'));
const AsyncContainerSection = lazy(() => import('./components/ContainerSection'));
const AsyncOrderSection = lazy(() => import('./components/OrderSection'));
const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));

type OptionalProps = {
  onFormReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  onFormReady: () => {},
};

export default class BatchForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { batch } = this.props;
    return !isEquals(batch, nextProps.batch);
  }

  render() {
    const { batch } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={BatchFormInSlideStyle}>
          <AsyncBatchSection batch={batch} />
          <AsyncQuantitySection />
          <AsyncPackagingSection />
          <AsyncTaskSection entityId={batch.id} type="batch" />
          <AsyncShipmentSection shipment={batch.shipment} />
          <AsyncContainerSection container={batch.container} />
          <AsyncOrderSection />
          <Subscribe to={[BatchTasksContainer, BatchInfoContainer]}>
            {(
              {
                state: {
                  todo: { tasks },
                },
                setFieldValue,
              },
              { state }
            ) => (
              <AutoDateBinding
                type="batch"
                values={state}
                tasks={tasks}
                setTaskValue={setFieldValue}
              />
            )}
          </Subscribe>
        </div>
      </Suspense>
    );
  }
}
