// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FocusedView } from 'modules/relationMapV2/store';
import type { UserPayload } from 'generated/graphql';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { Display, Label } from 'components/Form';
import { BATCH, BATCH_WIDTH } from 'modules/relationMapV2/constants';
import { isBefore, isAfter, differenceInCalendarDays } from 'utils/date';
import Heading from 'modules/relationMapV2/components/Heading';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { RightWrapperStyle, DatesWrapperStyle } from './style';

const getBatchDateRanges = (batches: Array<Object>) => {
  let oldestDelivery = null;
  let newestDelivery = null;
  let oldestDesired = null;
  let newestDesired = null;

  batches.forEach(batch => {
    const deliveredAt = batch?.deliveredAt || null;
    const desiredAt = batch?.desiredAt || null;

    if (deliveredAt) {
      if (!oldestDelivery) {
        oldestDelivery = deliveredAt;
      } else if (isBefore(new Date(deliveredAt), new Date(oldestDelivery))) {
        oldestDelivery = deliveredAt;
      }

      if (!newestDelivery) {
        newestDelivery = deliveredAt;
      } else if (isAfter(new Date(deliveredAt), new Date(newestDelivery))) {
        newestDelivery = deliveredAt;
      }
    }

    if (desiredAt) {
      if (!oldestDesired) {
        oldestDesired = desiredAt;
      } else if (isBefore(new Date(desiredAt), new Date(oldestDesired))) {
        oldestDesired = desiredAt;
      }

      if (!newestDesired) {
        newestDesired = desiredAt;
      } else if (isAfter(new Date(desiredAt), new Date(newestDesired))) {
        newestDesired = desiredAt;
      }
    }
  });

  return { oldestDelivery, newestDelivery, oldestDesired, newestDesired };
};

type Props = {|
  batches: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
  user: UserPayload,
|};

export default function BatchHeading({
  batches,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
  user,
}: Props) {
  const { oldestDelivery, newestDelivery, oldestDesired, newestDesired } = getBatchDateRanges(
    batches
  );

  // TODO: Replace with real permissions
  const canViewDelivery = true;
  const canViewDesired = true;
  const { state } = FocusedView.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const selectedItemsCount = batches.filter(item => batchIds.includes(item.id)).length;

  return (
    <Heading
      width={`${BATCH_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      selectedItemsCount={selectedItemsCount}
      onSelectAll={onSelectAll}
      renderRightSide={() => (
        <div className={RightWrapperStyle}>
          <div className={DatesWrapperStyle}>
            <Label width="75px">
              <FormattedMessage id="components.cards.delivery" />
            </Label>

            <Display blackout={!canViewDelivery}>
              <FormattedDateTZ value={oldestDelivery} user={user} />

              {oldestDelivery &&
                newestDelivery &&
                differenceInCalendarDays(new Date(oldestDelivery), new Date(newestDelivery)) !==
                  0 && (
                  <>
                    {' - '}
                    <FormattedDateTZ value={newestDelivery} user={user} />
                  </>
                )}
            </Display>
          </div>

          <div className={DatesWrapperStyle}>
            <Label width="75px">
              <FormattedMessage id="components.cards.desired" />
            </Label>

            <Display blackout={!canViewDesired}>
              <FormattedDateTZ value={oldestDesired} user={user} />

              {oldestDesired &&
                newestDesired &&
                differenceInCalendarDays(new Date(oldestDesired), new Date(newestDesired)) !==
                  0 && (
                  <>
                    {' - '}
                    <FormattedDateTZ value={newestDesired} user={user} />
                  </>
                )}
            </Display>
          </div>
        </div>
      )}
    />
  );
}
