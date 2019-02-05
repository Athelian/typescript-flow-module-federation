// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import BaseCard from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
import { OrderItemCard, WrapperCard } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import { ORDER_ITEM, BATCH } from 'modules/relationMap/constants';
import type { OrderItemProps } from 'modules/relationMapBeta/order/type.js.flow';

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
  const { dispatch } = context;
  const actions = actionCreators(dispatch);
  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" wrapperClassName={wrapperClassName}>
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
