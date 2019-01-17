// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import BaseCard from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import { OrderCard, WrapperCard, Tags } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import { actionCreators } from 'modules/relationMapBeta/order/store';
import type { OrderProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMap/constants';

type OptionalProps = {
  wrapperClassName?: string,
};

type Props = OptionalProps & OrderProps;

export default function Order({
  wrapperClassName,
  poNo,
  totalOrdered,
  totalBatched,
  totalShipped,
  tags,
  id,
  orderItems,
}: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { showTag },
    dispatch,
  } = context;
  const actions = actionCreators(dispatch);
  return (
    <BaseCard id={`order-${id}`} icon="ORDER" color="ORDER" wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            {/* NOTE: better naming for order card props */}
            <OrderCard
              order={{
                poNo,
                orderedQuantity: totalOrdered,
                batchedQuantity: totalBatched,
                shippedQuantity: totalShipped,
              }}
            />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.toggleHighLight(ORDER, id)}
                  />
                  <Action
                    icon="DOCUMENT"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.showEditForm(ORDER, id)}
                  />
                  <Action
                    icon="BRANCH"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() =>
                      actions.selectBranch([
                        {
                          entity: ORDER,
                          id,
                        },
                        ...orderItems.map(orderItem => ({
                          entity: ORDER_ITEM,
                          id: orderItem.id,
                        })),
                        ...orderItems.reduce(
                          (result, orderItem) =>
                            result.concat(
                              orderItem.batches.map(batch => ({
                                entity: BATCH,
                                id: batch.id,
                              }))
                            ),
                          []
                        ),
                      ])
                    }
                    className={RotateIcon}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.targetEntity(ORDER, id)}
                  />
                </>
              )}
            </ActionCard>
            {showTag && <Tags dataSource={tags} />}
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}
