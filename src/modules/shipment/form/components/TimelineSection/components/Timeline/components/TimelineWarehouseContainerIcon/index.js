// @flow
import React from 'react';
import Icon from 'components/Icon';
import { TimelineIconStyle, IconWrapperStyle } from './style';
import Ring from './Ring';

type Container = {
  warehouseArrivalAgreedDate: string,
  warehouseArrivalAgreedDateApprovedBy: string,
  warehouseArrivalActualDate: string,
  warehouseArrivalActualDateApprovedBy: string,
};
type Props = {
  containers: Array<Container>,
};

const defaultProps = {
  containers: [],
};

const getIconColor = (containers: Array<Container>) => {
  let color = 'TEAL';
  const allAgreed = containers.every(container => container.warehouseArrivalAgreedDateApprovedBy);
  containers.forEach(container => {
    const {
      warehouseArrivalAgreedDateApprovedBy: agreedDateApproved,
      warehouseArrivalActualDateApprovedBy: actualDateApproved,
    } = container;
    if (!agreedDateApproved && !actualDateApproved) {
      color = 'GRAY_LIGHT';
    } else if (allAgreed && !actualDateApproved) {
      color = 'BLUE';
    }
  });
  return color;
};

const getRingPercent = (containers: Array<Container>) => {
  const totalContainer = containers.length;
  if (totalContainer === 0) {
    return [0, 0];
  }
  let agreedDates = 0;
  let actualDates = 0;
  containers.forEach(container => {
    const {
      warehouseArrivalAgreedDateApprovedBy: agreedDateApproved,
      warehouseArrivalActualDateApprovedBy: actualDateApproved,
    } = container;
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

const TimelineWarehouseContainerIcon = (props: Props) => {
  const { containers } = props;
  const iconColor = getIconColor(containers);
  const [actualPercent, agreedPercent] = getRingPercent(containers);
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
TimelineWarehouseContainerIcon.defaultProps = defaultProps;
export default TimelineWarehouseContainerIcon;
