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

export default function OrderItem({ wrapperClassName, id, batches, ...rest }: Props) {
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
              {({ targetted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.toggleHighLight(ORDER_ITEM, id)}
                  />
                  <Action
                    icon="BRANCH"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() =>
                      actions.selectBranch([
                        {
                          entity: ORDER_ITEM,
                          id,
                        },
                        ...batches.map(batch => ({
                          entity: BATCH,
                          id: batch.id,
                        })),
                      ])
                    }
                    className={RotateIcon}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.targetEntity(ORDER_ITEM, id)}
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
