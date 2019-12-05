// @flow
import * as React from 'react';
import type { BatchPayload, OrderItemPayload, OrganizationPayload } from 'generated/graphql';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import SlideView from 'components/SlideView';
import NewShipmentForm from 'modules/shipment/common/NewShipmentForm';

type Props = {|
  getBatch: (batchId: string, item: Object) => BatchPayload,
  getOrderItem: (batchId: string, item: Object) => OrderItemPayload,
  getImporter: (batchId: string, item: Object) => ?OrganizationPayload,
  getExporter: (batchId: string, item: Object) => ?OrganizationPayload,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchMoveToNewShipmentActionImpl = ({
  onDone,
  getImporter,
  getExporter,
  getBatch,
  getOrderItem,
  entity,
  item,
}: ImplProps) => {
  const { isExporter, isImporter, isForwarder, organization } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const batch = getBatch(entity.id, item);
  const orderItem = getOrderItem(entity.id, item);
  const newBatches = [{ ...batch, orderItem }];
  const importer = getImporter(entity.id, item);
  const exporter = getExporter(entity.id, item);
  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <NewShipmentForm
        initDataForSlideView={{
          importer: isImporter() ? importer : null,
          forwarders: isForwarder() ? [organization] : [],
          exporter: isExporter() ? exporter : null,
          batches: newBatches.map(currentBatch => ({
            ...currentBatch,
            container: null,
            shipment: null,
          })),
          containers: [],
        }}
        onSuccessCallback={close}
        onCancel={close}
      />
    </SlideView>
  );
};

const BatchMoveToNewShipmentAction = (props: Props) => (actions: ActionComponentProps) => (
  <BatchMoveToNewShipmentActionImpl {...props} {...actions} />
);

export default BatchMoveToNewShipmentAction;
