// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import ActionDispatch from 'modules/relationMap/order/provider';
import { RMOrderCard } from 'components/Cards';
import { Tags } from 'components/RelationMap';
import type { OrderProps } from 'modules/relationMap/order/type.js.flow';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import ActionCard, { Action, DisabledAction } from 'modules/relationMap/common/ActionCard';
import { selectors, actionCreators } from 'modules/relationMap/order/store';
import { ORDER, ORDER_ITEM, BATCH } from 'constants/keywords';
import SelectedOrder from './SelectedOrder';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName?: string,
};

type Props = OptionalProps & OrderProps;

export default function Order({
  wrapperClassName,
  archived,
  poNo,
  totalOrdered,
  totalBatched,
  totalShipped,
  batchCount,
  batchShippedCount,
  todo,
  tags,
  id,
  orderItems,
  exporter,
  importer,
}: Props) {
  const context = React.useContext(ActionDispatch);
  const { dispatch, state } = context;
  const uiSelectors = selectors(state);
  const { clone } = state;
  const actions = actionCreators(dispatch);
  const isNewOrder = uiSelectors.isNewOrder(id);
  const showCloneBadge = (Object.entries(clone.orders || {}): Array<any>).some(([, item]) =>
    item.map(({ id: orderId }) => orderId).includes(id)
  );
  const { hasPermission } = usePermission();

  return (
    <BooleanValue>
      {({ value: hovered, set: setToggle }) => (
        <div
          className={wrapperClassName}
          onMouseEnter={() => setToggle(true)}
          onMouseLeave={() => setToggle(false)}
          id={`order-${id}`}
        >
          <RMOrderCard
            order={{
              archived,
              poNo,
              exporter,
              importer,
              orderedQuantity: totalOrdered,
              batchedQuantity: totalBatched,
              shippedQuantity: totalShipped,
              batched: batchCount,
              shipped: batchShippedCount,
              todo,
            }}
          />
          {(showCloneBadge || isNewOrder) && <Badge label={showCloneBadge ? 'clone' : 'new'} />}
          {id && (
            <>
              {uiSelectors.isAllowToConnectOrder() && state.connectOrder.enableSelectMode ? (
                (() => {
                  if (!uiSelectors.isAllowToSelectOrder(exporter.id, importer.id)) {
                    return <ActionCard show>{() => <DisabledAction />}</ActionCard>;
                  }
                  if (uiSelectors.selectedConnectOrder(id)) {
                    return (
                      <ActionCard show>
                        {() => <SelectedOrder onClick={() => actions.toggleSelectedOrder(id)} />}
                      </ActionCard>
                    );
                  }
                  return (
                    <ActionCard show={hovered}>
                      {() => (
                        <Action icon="CHECKED" onClick={() => actions.toggleSelectedOrder(id)} />
                      )}
                    </ActionCard>
                  );
                })()
              ) : (
                <ActionCard show={hovered}>
                  {({ targeted, toggle }) => (
                    <>
                      <Action
                        icon="MAGIC"
                        targeted={targeted}
                        toggle={toggle}
                        onClick={() => actions.toggleHighLight(ORDER, id)}
                        tooltipMessage={
                          <FormattedMessage
                            id="modules.RelationMaps.highlightTooltip"
                            defaultMessage="Highlight / Unhighlight"
                          />
                        }
                      />
                      <Action
                        icon="DOCUMENT"
                        targeted={targeted}
                        toggle={toggle}
                        onClick={() => actions.showEditForm(ORDER, id)}
                        tooltipMessage={
                          <FormattedMessage
                            id="modules.RelationMaps.viewFormTooltip"
                            defaultMessage="View Form"
                          />
                        }
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
                                  entity: ORDER,
                                  id,
                                  exporterId: `${ORDER}-${exporter.id}`,
                                },
                                ...orderItems.map(orderItem => ({
                                  entity: ORDER_ITEM,
                                  id: orderItem.id,
                                  exporterId: `${ORDER_ITEM}-${exporter.id}`,
                                })),
                                ...orderItems.reduce(
                                  (result, orderItem) =>
                                    result.concat(
                                      orderItem.batches.map(batch => ({
                                        entity: BATCH,
                                        id: batch.id,
                                        exporterId: `${BATCH}-${exporter.id}`,
                                      }))
                                    ),
                                  []
                                ),
                              ])
                            }
                            className={RotateIcon}
                            tooltipMessage={
                              <FormattedMessage
                                id="modules.RelationMaps.targetTreeTooltip"
                                defaultMessage="Target / Untarget Tree"
                              />
                            }
                          />
                          <Action
                            icon="CHECKED"
                            targeted={targeted}
                            toggle={toggle}
                            onClick={() => actions.targetOrderEntity(id, `${ORDER}-${exporter.id}`)}
                            tooltipMessage={
                              <FormattedMessage
                                id="modules.RelationMaps.targetTooltip"
                                defaultMessage="Target / Untarget"
                              />
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </ActionCard>
              )}
            </>
          )}
          {state.showTag && <Tags dataSource={tags} />}
        </div>
      )}
    </BooleanValue>
  );
}
