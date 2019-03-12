// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import scrollIntoView from 'utils/scrollIntoView';
import { injectUid } from 'utils/id';
import { TaskCard } from 'components/Cards';
import { ItemGridStyle, ItemStyle, EmptyMessageStyle } from './style';

type Props = {
  tasks: Array<Object>,
  onRemove: Function,
  onSave: Function,
};

export function generateBatchItem(shipmentItem: Object, batches: Array<Object>) {
  const {
    productProvider: {
      packageName,
      packageCapacity,
      packageGrossWeight,
      packageVolume,
      packageSize,
    },
  } = shipmentItem;
  return injectUid({
    shipmentItem,
    tags: [],
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
    quantity: 0,
    isNew: true,
    batchAdjustments: [],
    no: `batch no ${batches.length + 1}`,
    autoCalculatePackageQuantity: true,
  });
}

const ShipmentTasks = ({ tasks, onRemove, onSave }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(SHIPMENT_UPDATE);
  return tasks.length > 0 ? (
    <div className={ItemGridStyle}>
      {tasks.map((task, index) => (
        <div id={`shipmentTask_${task.id}`} className={ItemStyle} key={task.id}>
          <TaskCard
            editable={allowUpdate}
            task={task}
            saveOnBlur={newValue => onSave(index, newValue)}
            onClick={() => {
              scrollIntoView({
                targetId: `shipmentTask_${task.id}`,
                boundaryId: 'tasksSection',
              });
            }}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className={EmptyMessageStyle}>
      <FormattedMessage id="modules.Shipments.form.noTasks" defaultMessage="No tasks" />
    </div>
  );
};

export default ShipmentTasks;
