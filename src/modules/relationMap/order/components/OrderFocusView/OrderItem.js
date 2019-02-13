// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import BaseCard from 'components/Cards';
import { OrderItemCard, WrapperCard } from 'components/RelationMap';
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
        shipped += 1;
      }
    });
  }

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
  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" wrapperClassName={wrapperClassName}>
      {showCloneBadge && <Badge label="clone" />}
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            <OrderItemCard
              orderItem={{ ...rest, batches, ...getQuantitySummary({ ...rest, batches }) }}
            />
            <ActionCard show={hovered}>
              {({ targeted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targeted={targeted}
                    toggle={toggle}
                    onClick={() => actions.toggleHighLight(ORDER_ITEM, id)}
                  />
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
            </ActionCard>
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}
