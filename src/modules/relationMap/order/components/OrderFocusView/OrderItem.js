// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { Tags } from 'components/RelationMap';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import { RMOrderItemCard } from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import ActionDispatch from 'modules/relationMap/order/provider';
import { actionCreators } from 'modules/relationMap/order/store';
import { ORDER_ITEM, BATCH } from 'constants/keywords';
import type { OrderItemProps } from 'modules/relationMap/order/type.js.flow';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName?: string,
  parentOrderId: string,
  exporter: Object,
  importer: Object,
};

type Props = OptionalProps & OrderItemProps;

// TODO: try to use from util
function getQuantitySummary(item: Object) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;

  orderedQuantity += item.quantity ? item.quantity : 0;

  if (item.batches) {
    item.batches.forEach(batch => {
      const { latestQuantity } = batch;

      batchedQuantity += latestQuantity;
      batched += 1;

      if (batch.shipment) {
        shippedQuantity += latestQuantity;
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

export default function OrderItem({
  wrapperClassName,
  id,
  archived,
  parentOrderId,
  importer,
  exporter,
  batches,
  tags,
  ...rest
}: Props) {
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const actions = actionCreators(dispatch);
  const { clone, showTag } = state;
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
                  onClick={() => actions.showEditForm(ORDER_ITEM, id)}
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
                            id,
                            entity: ORDER_ITEM,
                            exporterId: `${id}-${exporter.id}`,
                            importerId: `${id}-${importer.id}`,
                            partners: [importer, exporter],
                          },
                          ...batches.map(batch => ({
                            entity: BATCH,
                            id: batch.id,
                            exporterId: `${id}-${exporter.id}`,
                            importerId: `${id}-${importer.id}`,
                            partners: [importer, exporter],
                          })),
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
                      onClick={() =>
                        actions.targetOrderItemEntity({
                          id,
                          parentOrderId,
                          exporterId: `${id}-${exporter.id}`,
                          importerId: `${id}-${importer.id}`,
                          partners: [importer, exporter],
                        })
                      }
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
          {showTag && <Tags dataSource={tags} />}
        </div>
      )}
    </BooleanValue>
  );
}
