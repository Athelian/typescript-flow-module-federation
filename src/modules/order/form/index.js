// @flow

import * as React from 'react';
import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import useUser from 'hooks/useUser';
import { SectionWrapper } from 'components/Form';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import ContainersSection from './components/ContainersSection';
import OrderTasksSection from './components/OrderTasksSection';
import CleanUpOrder from './components/CleanUpOrder';
import { OrderInfoContainer, OrderTasksContainer, OrderItemsContainer } from './containers';
import { OrderFormWrapperStyle } from './style';

type OptionalProps = {
  isNew?: boolean,
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

const OrderForm = (props: Props) => {
  const { isNew, isClone, order, loading } = { ...defaultProps, ...props };

  const { organization } = useUser();

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
              entityOwnerId={!isClone && order.id ? order?.ownedBy?.id : organization?.id}
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
          <AutoDateBinding type="Order" values={state} tasks={tasks} setTaskValue={setFieldValue} />
        )}
      </Subscribe>
      <Subscribe to={[OrderItemsContainer]}>
        {orderItemsContainer => (
          <CleanUpOrder
            orderId={order?.id}
            isNew={isClone || isNew}
            orderItemsContainer={orderItemsContainer}
          />
        )}
      </Subscribe>
    </div>
  );
};

export default OrderForm;
