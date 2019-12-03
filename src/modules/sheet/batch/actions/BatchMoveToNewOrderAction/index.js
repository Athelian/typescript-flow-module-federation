// @flow
import * as React from 'react';
import type {
  OrderPayload,
  OrderItemPayload,
  BatchPayload,
  ContainerPayload,
  ShipmentPayload,
} from 'generated/graphql';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import SlideView from 'components/SlideView';
import { generateItemForMovedBatch } from 'utils/item';

type Props = {|
  getBatch: (batchId: string, order: OrderPayload) => BatchPayload,
  getOrderItem: (batchId: string, order: OrderPayload) => OrderItemPayload,
  getContainer: (batchId: string, order: OrderPayload) => ?ContainerPayload,
  getShipment: (batchId: string, order: OrderPayload) => ?ShipmentPayload,
|};

function BatchMoveToNewOrderActionImpl({
  entity,
  item: order,
  onDone,
  getBatch,
  getContainer,
  getShipment,
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
  const container = getContainer(entity.id, order);
  const shipment = getShipment(entity.id, order);
  if (container) {
    newContainers.push(container);
  }
  if (shipment) {
    newShipments.push(shipment);
  }

  newOrderItems.push(generateItemForMovedBatch(newOrderItem, batch));

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <NewOrderForm
        originalDataForSlideView={{
          orderItems: newOrderItems.map(currentOrderItem => ({
            id: currentOrderItem.id,
            isNew: true,
            batches: currentOrderItem.batches.map(currentBatch => ({
              ...currentBatch,
              isNew: true,
              quantity: 0,
            })),
          })),
        }}
        initDataForSlideView={{
          importer: isImporter() ? organization : {},
          exporter,
          orderItems: newOrderItems,
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
