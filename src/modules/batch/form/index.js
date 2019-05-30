// @flow
import React, { Suspense } from 'react';
import { Subscribe } from 'unstated';
import { isEquals } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import TaskSection from 'modules/task/common/TaskSection';
import { BatchInfoContainer, BatchTasksContainer } from './containers';
import BatchSection from './components/BatchSection';
import QuantitySection from './components/QuantitySection';
import PackagingSection from './components/PackagingSection';
import ShipmentSection from './components/ShipmentSection';
import ContainerSection from './components/ContainerSection';
import OrderSection from './components/OrderSection';
import {
  NAVIGABLE,
  type ItemConfigType,
  type ShipmentConfigType,
  type ContainerConfigType,
  type OrderConfigType,
} from './type';
import { BatchFormInSlideStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
  itemConfig: ItemConfigType,
  shipmentConfig: ShipmentConfigType,
  containerConfig: ContainerConfigType,
  orderConfig: OrderConfigType,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  onFormReady: () => {},
  itemConfig: NAVIGABLE,
  shipmentConfig: NAVIGABLE,
  containerConfig: NAVIGABLE,
  orderConfig: NAVIGABLE,
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
    const { batch, itemConfig, shipmentConfig, containerConfig, orderConfig } = this.props;

    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={BatchFormInSlideStyle}>
          <BatchSection batch={batch} itemConfig={itemConfig} />
          <QuantitySection />
          <PackagingSection />
          <TaskSection entityId={batch.id} type="batch" />
          <ShipmentSection shipment={batch.shipment} shipmentConfig={shipmentConfig} />
          <ContainerSection container={batch.container} containerConfig={containerConfig} />
          <OrderSection orderConfig={orderConfig} />
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
