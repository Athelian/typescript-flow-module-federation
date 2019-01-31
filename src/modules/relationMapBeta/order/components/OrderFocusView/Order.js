// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import BaseCard from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import { OrderCard, WrapperCard, Tags } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import { selectors, actionCreators } from 'modules/relationMapBeta/order/store';
import type { OrderProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMap/constants';

type OptionalProps = {
  wrapperClassName?: string,
  orderItemsCollection?: Object,
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
  exporter,
  orderItemsCollection,
}: Props) {
  const context = React.useContext(ActionDispatch);
  const { dispatch, state } = context;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  return (
    <BaseCard id={`order-${id}`} icon="ORDER" color="ORDER" wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            <OrderCard
              order={{
                poNo,
                orderedQuantity: totalOrdered,
                batchedQuantity: totalBatched,
                shippedQuantity: totalShipped,
              }}
            />
            {uiSelectors.isAllowToSelectOrder({
              orderId: id,
              exporterId: exporter.id,
              orderItems: orderItemsCollection,
            }) ? (
              <ActionCard show={hovered}>
                {() => <Action icon="CHECKED" onClick={console.warn} />}
              </ActionCard>
            ) : (
              <ActionCard show={hovered}>
                {({ targeted, toggle }) => (
                  <>
                    <Action
                      icon="MAGIC"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.toggleHighLight(ORDER, id)}
                    />
                    <Action
                      icon="DOCUMENT"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.showEditForm(ORDER, id)}
                    />
                    <Action
                      icon="BRANCH"
                      targeted={targeted}
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
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.targetOrderEntity(id, `${ORDER}-${exporter.id}`)}
                    />
                  </>
                )}
              </ActionCard>
            )}
            {state.showTag && <Tags dataSource={tags} />}
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}
