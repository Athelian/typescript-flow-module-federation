// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FocusedView } from 'modules/relationMapV2/store';
import FormattedDate from 'components/FormattedDate';
import { Display, Label } from 'components/Form';
import { CONTAINER, CONTAINER_WIDTH } from 'modules/relationMapV2/constants';
import { isBefore, isAfter, differenceInMinutes } from 'utils/date';
import Heading from 'modules/relationMapV2/components/Heading';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { RightWrapperStyle, DatesWrapperStyle, DashStyle } from './style';

const getContainerDateRanges = (containers: Array<Object>) => {
  let oldestDelivery = null;
  let newestDelivery = null;

  containers.forEach(container => {
    const deliveredAt =
      container?.warehouseArrivalActualDate || container?.warehouseArrivalAgreedDate || null;

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
  });

  return { oldestDelivery, newestDelivery };
};

type Props = {|
  containers: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
|};

export default function ContainerHeading({
  containers,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
}: Props) {
  const { oldestDelivery, newestDelivery } = getContainerDateRanges(containers);

  // TODO: Replace with real permissions
  const canViewDelivery = true;

  const { state } = FocusedView.useContainer();
  const containerIds = targetedIds(state.targets, CONTAINER);
  const selectedItemsCount = containers.filter(item => containerIds.includes(item.id)).length;

  return (
    <Heading
      width={`${CONTAINER_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      selectedItemsCount={selectedItemsCount}
      onSelectAll={onSelectAll}
      renderRightSide={() => (
        <div className={RightWrapperStyle}>
          <Label width="75px">
            <FormattedMessage id="components.cards.delivery" />
          </Label>

          <div className={DatesWrapperStyle}>
            <Display blackout={!canViewDelivery}>
              <FormattedDate value={oldestDelivery} mode="datetime" />
            </Display>

            {canViewDelivery &&
              oldestDelivery &&
              newestDelivery &&
              differenceInMinutes(new Date(oldestDelivery), new Date(newestDelivery)) !== 0 && (
                <>
                  <div className={DashStyle}>-</div>
                  <Display>
                    <FormattedDate value={newestDelivery} mode="datetime" />
                  </Display>
                </>
              )}
          </div>
        </div>
      )}
    />
  );
}
