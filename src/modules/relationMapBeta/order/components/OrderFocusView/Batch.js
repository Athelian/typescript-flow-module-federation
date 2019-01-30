// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
import BaseCard from 'components/Cards';
import { BatchCard, WrapperCard, Tags } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import { BATCH } from 'modules/relationMap/constants';
import type { BatchProps } from 'modules/relationMapBeta/order/type.js.flow';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName?: string,
  parentOrderId?: string,
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
  tags,
  no,
  quantity,
  totalAdjusted,
  packageVolume,
}: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { showTag, split, clone, balanceSplit },
    dispatch,
  } = context;
  const actions = actionCreators(dispatch);
  const showSplitBadge = (Object.entries(split.batches): Array<any>).some(([, item]) =>
    item.map(({ id: batchId }) => batchId).includes(id)
  );
  const showCloneBadge = (Object.entries(clone.batches): Array<any>).some(([, item]) =>
    item.map(({ id: batchId }) => batchId).includes(id)
  );
  const showAutoFillBadge = !!balanceSplit.batches.find(item => item.id === id);
  return (
    <BaseCard showActionsOnHover icon="BATCH" color="BATCH" wrapperClassName={wrapperClassName}>
      {(showSplitBadge || showAutoFillBadge || showCloneBadge) && (
        <Badge label={findBadgeLabel({ showSplitBadge, showCloneBadge, showAutoFillBadge })} />
      )}
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            <BatchCard
              batch={{
                no,
                volumeLabel: packageVolume && packageVolume.value,
                metric: packageVolume && packageVolume.metric,
                batchedQuantity: quantity + totalAdjusted,
              }}
            />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.toggleHighLight(BATCH, id)}
                  />
                  <Action
                    icon="DOCUMENT"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.showEditForm(BATCH, id)}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.targetBatchEntity(id, parentOrderId || '')}
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
