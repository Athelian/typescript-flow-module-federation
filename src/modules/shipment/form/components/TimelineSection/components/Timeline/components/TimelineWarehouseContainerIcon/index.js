// @flow
import * as React from 'react';
import type { ContainerPayload } from 'generated/graphql';
import { Link } from '@reach/router';
import scrollIntoView from 'utils/scrollIntoView';
import { getByPath } from 'utils/fp';
import Icon from 'components/Icon';
import { TimelineIconStyle, IconWrapperStyle } from './style';
import Ring from './Ring';

type Props = {|
  containers: Array<ContainerPayload>,
  linkPath?: string,
  targetId?: string,
  boundaryId?: string,
|};

const getApproved = (container: Object) => {
  const agreedDateApproved = getByPath('warehouseArrivalAgreedDateApprovedAt', container);
  const actualDateApproved = getByPath('warehouseArrivalActualDateApprovedAt', container);
  return { agreedDateApproved, actualDateApproved };
};
const getIconColor = (containers: Array<ContainerPayload>) => {
  let color = 'TEAL';
  const allAgreed = containers.every(
    container => !getByPath('warehouseArrivalAgreedDateApprovedAt', container)
  );
  containers.forEach(container => {
    const { agreedDateApproved, actualDateApproved } = getApproved(container);
    if (!agreedDateApproved && !actualDateApproved) {
      color = 'GRAY_LIGHT';
    } else if (allAgreed && !actualDateApproved) {
      color = 'BLUE';
    }
  });
  return color;
};

const getRingPercent = (containers: Array<ContainerPayload>) => {
  const totalContainer = containers.length;
  if (totalContainer === 0) {
    return [0, 0];
  }
  let agreedDates = 0;
  let actualDates = 0;
  containers.forEach(container => {
    const { agreedDateApproved, actualDateApproved } = getApproved(container);
    if (agreedDateApproved) {
      agreedDates += 1;
    }
    if (actualDateApproved) {
      actualDates += 1;
    }
  });
  const actualPercent = (actualDates / totalContainer) * 100;
  const agreedPercent = (agreedDates / totalContainer) * 100;
  return [actualPercent, agreedPercent];
};

const TimelineWarehouseContainerIcon = ({ containers, linkPath, targetId, boundaryId }: Props) => {
  const iconColor = getIconColor(containers);
  const [actualPercent, agreedPercent] = getRingPercent(containers);

  if (linkPath) {
    return (
      <Link
        className={TimelineIconStyle}
        to={linkPath}
        onClick={evt => {
          evt.stopPropagation();
        }}
      >
        <Ring percent={actualPercent} size={30} color="TEAL" />
        <Ring percent={agreedPercent} size={26} color="BLUE" />
        <div className={IconWrapperStyle(iconColor)}>
          <Icon icon="WAREHOUSE" />
        </div>
      </Link>
    );
  }

  if (targetId) {
    return (
      <button
        className={TimelineIconStyle}
        onClick={() => scrollIntoView({ targetId, boundaryId })}
        type="button"
      >
        <Ring percent={actualPercent} size={30} color="TEAL" />
        <Ring percent={agreedPercent} size={26} color="BLUE" />
        <div className={IconWrapperStyle(iconColor)}>
          <Icon icon="WAREHOUSE" />
        </div>
      </button>
    );
  }

  return (
    <div className={TimelineIconStyle}>
      <Ring percent={actualPercent} size={30} color="TEAL" />
      <Ring percent={agreedPercent} size={26} color="BLUE" />
      <div className={IconWrapperStyle(iconColor)}>
        <Icon icon="WAREHOUSE" />
      </div>
    </div>
  );
};

export default TimelineWarehouseContainerIcon;
