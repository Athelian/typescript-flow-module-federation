// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import { RMOrderItemCard } from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import ActionDispatch from 'modules/relationMap/order/provider';
import { actionCreators } from 'modules/relationMap/order/store';
import { ORDER_ITEM, BATCH } from 'modules/relationMap/constants';
import type { OrderItemProps } from 'modules/relationMap/order/type.js.flow';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName?: string,
  /**
   * Exporter Id for tracking order item is same exporter
   */
  exporterId: string,
};

type Props = OptionalProps & OrderItemProps;

function getQuantitySummary(item: Object) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;
  const shipments = [];

  orderedQuantity += item.quantity ? item.quantity : 0;

  if (item.batches) {
    item.batches.forEach(batch => {
      batchedQuantity += batch.quantity;
      batched += 1;

      let currentQuantity = batch.quantity;

      if (batch.batchAdjustments) {
        batch.batchAdjustments.forEach(batchAdjustment => {
          batchedQuantity += batchAdjustment.quantity;
          currentQuantity += batchAdjustment.quantity;
        });
      }

      if (batch.shipment) {
        shippedQuantity += currentQuantity;
        if (!shipments.includes(batch.shipment)) {
          shipments.push(batch.shipment);
        }
      }
    });
  }
  shipped = shipments.length;

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
  };
}

export default function OrderItem({ wrapperClassName, id, exporterId, batches, ...rest }: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { clone },
    dispatch,
  } = context;
  const actions = actionCreators(dispatch);
  const showCloneBadge = (Object.entries(clone.orderItems || {}): Array<any>).some(([, item]) =>
    item.map(({ id: orderItemId }) => orderItemId).includes(id)
  );
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <BooleanValue>
      {({ value: hovered, set: setToggle }) => (
        <div
          className={wrapperClassName}
          onMouseEnter={() => setToggle(true)}
          onMouseLeave={() => setToggle(false)}
        >
          <RMOrderItemCard
            orderItem={{ ...rest, batches, ...getQuantitySummary({ ...rest, batches }) }}
          />
          {showCloneBadge && <Badge label="clone" />}
          <ActionCard show={hovered}>
            {({ targeted, toggle }) => (
              <>
                <Action
                  icon="MAGIC"
                  targeted={targeted}
                  toggle={toggle}
                  onClick={() => actions.toggleHighLight(ORDER_ITEM, id)}
                />
                {hasPermission(RM_ORDER_FOCUS_MANIPULATE) && (
                  <>
                    <Action
                      icon="BRANCH"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() =>
                        actions.selectBranch([
                          {
                            id,
                            entity: ORDER_ITEM,
                            exporterId: `${ORDER_ITEM}-${exporterId}`,
                          },
                          ...batches.map(batch => ({
                            entity: BATCH,
                            id: batch.id,
                            exporterId: `${BATCH}-${exporterId}`,
                          })),
                        ])
                      }
                      className={RotateIcon}
                    />
                    <Action
                      icon="CHECKED"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.targetOrderItemEntity(id, `${id}-${exporterId}`)}
                    />
                  </>
                )}
              </>
            )}
          </ActionCard>
        </div>
      )}
    </BooleanValue>
  );
}
