// @flow
import * as React from 'react';
import type { OrderPayload, OrderItemPayload, BatchPayload } from 'generated/graphql';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import SlideView from 'components/SlideView';
import { uuid } from 'utils/id';

type Props = {|
  getBatch: (batchId: string, order: OrderPayload) => BatchPayload,
  getOrderItem: (batchId: string, order: OrderPayload) => OrderItemPayload,
|};

function BatchMoveToNewOrderActionImpl({
  entity,
  item: order,
  onDone,
  getBatch,
  getOrderItem,
}: {|
  ...ActionComponentProps,
  ...Props,
|}) {
  const { isImporter, organization } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const { exporter } = order;
  const batch = getBatch(entity.id, order);
  const orderItem = getOrderItem(entity.id, order);
  const newOrderItems = [];
  const { id: itemId, ...newOrderItem } = orderItem;
  const newContainers = [];
  const newShipments = [];
  if (batch.container) {
    newContainers.push(batch.container);
  }
  if (batch.shipment) {
    newShipments.push(batch.shipment);
  }

  const defaultItemValues = {
    customFields: {
      mask: null,
      fieldValues: [],
    },
    todo: {
      tasks: [],
    },
    tags: [],
    files: [],
    memo: '',
  };
  newOrderItems.push({
    ...newOrderItem,
    ...defaultItemValues,
    no: `[auto] ${newOrderItem.no}`,
    quantity: 0,
    isNew: true,
    id: uuid(),
    batches: [batch],
    // NOTE: send the original data before normalize from gtv
    price: {
      amount: orderItem?.price?.value ?? 0,
      currency: orderItem?.price?.metric ?? 'JPY',
    },
  });

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <NewOrderForm
        originalDataForSlideView={{
          orderItems: newOrderItems.map(currentOrderItem => ({
            ...defaultItemValues,
            id: currentOrderItem.id,
            isNew: true,
            batches: currentOrderItem.batches.map(currentBatch => ({
              ...currentBatch,
              isNew: true,
            })),
          })),
        }}
        initDataForSlideView={{
          importer: isImporter() ? organization : {},
          exporter,
          orderItems: newOrderItems.map(item => ({
            ...item,
            ...defaultItemValues,
            no: `[auto] ${item.no}`,
            quantity: 0,
          })),
          containers: newContainers,
          shipments: newShipments,
        }}
        onCancel={close}
        onSuccessCallback={close}
      />
    </SlideView>
  );
}

export default function BatchMoveToNewOrderAction(props: Props) {
  return (actions: ActionComponentProps) => (
    <BatchMoveToNewOrderActionImpl {...props} {...actions} />
  );
}
