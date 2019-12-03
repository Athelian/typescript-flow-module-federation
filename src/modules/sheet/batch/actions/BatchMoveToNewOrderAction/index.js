// @flow
import * as React from 'react';
import type {
  OrderItemPayload,
  BatchPayload,
  ContainerPayload,
  ShipmentPayload,
  OrganizationPayload,
} from 'generated/graphql';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import SlideView from 'components/SlideView';
import { generateItemForMovedBatch } from 'utils/item';

type Props = {|
  getBatch: (batchId: string, item: Object) => BatchPayload,
  getOrderItem: (batchId: string, item: Object) => OrderItemPayload,
  getContainer: (batchId: string, item: Object) => ?ContainerPayload,
  getShipment: (batchId: string, item: Object) => ?ShipmentPayload,
  getExporter: (batchId: string, item: Object) => OrganizationPayload,
|};

function BatchMoveToNewOrderActionImpl({
  entity,
  item,
  onDone,
  getBatch,
  getContainer,
  getShipment,
  getOrderItem,
  getExporter,
}: {|
  ...ActionComponentProps,
  ...Props,
|}) {
  const { isImporter, organization } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const batch = getBatch(entity.id, item);
  const exporter = getExporter(entity.id, item);
  const orderItem = getOrderItem(entity.id, item);
  const newOrderItems = [];
  const { id: itemId, ...newOrderItem } = orderItem;
  const newContainers = [];
  const newShipments = [];
  const container = getContainer(entity.id, item);
  const shipment = getShipment(entity.id, item);
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
