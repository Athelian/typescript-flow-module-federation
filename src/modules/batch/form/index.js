// @flow
import React, { lazy, Suspense } from 'react';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
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
  isNew: boolean,
  isClone: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
  onFormReady: () => {},
};

export default class BatchForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { batch, isNew } = this.props;

    return !isEquals(batch, nextProps.batch) || !isEquals(isNew, nextProps.isNew);
  }

  onClone = () => {
    const { batch } = this.props;
    navigate(`/batch/clone/${encodeId(batch.id)}`);
  };

  render() {
    const { batch, isNew, isClone } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={BatchFormInSlideStyle}>
          <AsyncBatchSection isNew={isNew} isClone={isClone} batch={batch} />
          <AsyncQuantitySection isNew={isNew} />
          <AsyncPackagingSection isNew={isNew} />
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
