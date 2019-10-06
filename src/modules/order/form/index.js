// @flow

import * as React from 'react';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { getByPath } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionWrapper } from 'components/Form';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import ContainersSection from './components/ContainersSection';
import OrderTasksSection from './components/OrderTasksSection';
import { OrderInfoContainer, OrderTasksContainer, OrderItemsContainer } from './containers';
import { OrderFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  loading: boolean,
  isClone: boolean,
  order: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  loading: false,
  order: {},
};

export default class OrderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  onClone = () => {
    const { order } = this.props;
    navigate(`/order/clone/${encodeId(order.id)}`);
  };

  render() {
    const { isNew, isClone, order, loading } = this.props;

    return (
      <div className={OrderFormWrapperStyle}>
        <SectionWrapper id="order_orderSection">
          <OrderSection order={order} isNew={isNew} isClone={isClone} isLoading={loading} />
        </SectionWrapper>

        <SectionWrapper id="order_itemsSection">
          <ItemsSection
            isNew={isNew}
            entityId={!isClone && order.id ? order.id : ''}
            isLoading={loading}
            orderIsArchived={order.archived}
          />
        </SectionWrapper>

        <SectionWrapper id="order_documentsSection">
          <DocumentsSection entityId={!isClone && order.id ? order.id : ''} isLoading={loading} />
        </SectionWrapper>

        <SectionWrapper id="order_taskSection">
          <Subscribe to={[OrderTasksContainer, OrderInfoContainer]}>
            {({ initDetailValues }, { state: { importer, exporter } }) => (
              <OrderTasksSection
                groupIds={[getByPath('id', importer), getByPath('id', exporter)].filter(Boolean)}
                initValues={initDetailValues}
                isLoading={loading}
                entityId={!isClone && order.id ? order.id : ''}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="order_shipmentsSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: { hasCalledItemsApiYet }, getShipments }) => (
              <ShipmentsSection
                isReady={hasCalledItemsApiYet || isNew || isClone}
                shipments={getShipments()}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="order_containersSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: { hasCalledItemsApiYet }, getContainers }) => (
              <ContainersSection
                isReady={hasCalledItemsApiYet || isNew || isClone}
                containers={getContainers()}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <Subscribe to={[OrderTasksContainer, OrderInfoContainer]}>
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
              type="Order"
              values={state}
              tasks={tasks}
              setTaskValue={setFieldValue}
            />
          )}
        </Subscribe>
      </div>
    );
  }
}
