// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import ActionDispatch from 'modules/relationMap/order/provider';
import { actionCreators } from 'modules/relationMap/order/store';
import { RMBatchCard } from 'components/Cards';
import { Tags } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import { BATCH } from 'constants/keywords';
import type { BatchProps } from 'modules/relationMap/order/type.js.flow';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName?: string,
  /**
   * Parent Order Id for quickly find the order id to refetch data after split action
   */
  parentOrderId: string,
  /**
   * Exporter Id for tracking order item is same exporter
   */
  exporterId: string,
};

type Props = OptionalProps & BatchProps;

function findBadgeLabel({
  showSplitBadge,
  showAutoFillBadge,
  showCloneBadge,
}: {
  showSplitBadge: boolean,
  showCloneBadge: boolean,
  showAutoFillBadge: boolean,
}) {
  if (showSplitBadge) return 'Split';
  if (showAutoFillBadge) return 'autoFill';
  if (showCloneBadge) return 'clone';
  return '';
}

export default function Batch({
  wrapperClassName,
  id,
  parentOrderId,
  exporterId,
  tags,
  no,
  quantity,
  totalAdjusted,
  totalVolume,
  deliveredAt,
  shipment,
  container,
  todo,
}: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { showTag, split, clone, balanceSplit },
    dispatch,
  } = context;
  const actions = actionCreators(dispatch);
  const showSplitBadge = (Object.entries(split.batches || {}): Array<any>).some(([, item]) =>
    item.map(({ id: batchId }) => batchId).includes(id)
  );
  const showCloneBadge = (Object.entries(clone.batches || {}): Array<any>).some(([, item]) =>
    item.map(({ id: batchId }) => batchId).includes(id)
  );
  const showAutoFillBadge = !!balanceSplit.batches.find(item => item.id === id);
  const { hasPermission } = usePermission();
  return (
    <BooleanValue>
      {({ value: hovered, set: setToggle }) => (
        <div
          className={wrapperClassName}
          onMouseEnter={() => setToggle(true)}
          onMouseLeave={() => setToggle(false)}
        >
          <RMBatchCard
            batch={{
              no,
              totalVolume,
              batchedQuantity: quantity + totalAdjusted,
              deliveredAt,
              shipment,
              container,
              todo,
            }}
          />
          {(showSplitBadge || showAutoFillBadge || showCloneBadge) && (
            <Badge label={findBadgeLabel({ showSplitBadge, showCloneBadge, showAutoFillBadge })} />
          )}
          <ActionCard show={hovered}>
            {({ targeted, toggle }) => (
              <>
                <Action
                  icon="MAGIC"
                  targeted={targeted}
                  toggle={toggle}
                  onClick={() => actions.toggleHighLight(BATCH, id)}
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
                  onClick={() => actions.showEditForm(BATCH, id)}
                  tooltipMessage={
                    <FormattedMessage
                      id="modules.RelationMaps.viewFormTooltip"
                      defaultMessage="View Form"
                    />
                  }
                />
                {hasPermission(RM_ORDER_FOCUS_MANIPULATE) && (
                  <Action
                    icon="CHECKED"
                    targeted={targeted}
                    toggle={toggle}
                    onClick={() =>
                      actions.targetBatchEntity({
                        id,
                        parentOrderId,
                        exporterId: `${id}-${exporterId}`,
                      })
                    }
                    tooltipMessage={
                      <FormattedMessage
                        id="modules.RelationMaps.targetTooltip"
                        defaultMessage="Target / Untarget"
                      />
                    }
                  />
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
