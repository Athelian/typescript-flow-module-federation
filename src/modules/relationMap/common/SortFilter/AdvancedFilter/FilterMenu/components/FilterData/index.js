// @flow
import React from 'react';
import { getByPath } from 'utils/fp';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import { FilterDataWrapperStyle, FilterDataStyle } from './style';

type Props = {
  onClick: Function,
  field: ?string,
  data: any,
};
const FilterData = ({ onClick, field, data }: Props) => {
  if (!field) {
    return null;
  }
  switch (field) {
    default:
      return (
        <div className={FilterDataWrapperStyle}>
          {data.map(datum => (
            <button
              key={datum.id ? datum.id : uuid()}
              className={FilterDataStyle}
              type="button"
              onClick={() => onClick(datum)}
            >
              {field && getByPath(field, datum)}
              <Icon icon="CLEAR" />
            </button>
          ))}
        </div>
      );
    case 'createdAt':
    case 'updatedAt':
    case 'deliveredAt':
    case 'expiredAt':
    case 'producedAt':
    case 'cargoReady':
    case 'loadPortDeparture':
    case 'firstTransitPortArrival':
    case 'firstTransitPortDeparture':
    case 'secondTransitPortArrival':
    case 'secondTransitPortDeparture':
    case 'dischargePortArrival':
    case 'customClearance':
    case 'warehouseArrival':
    case 'deliveryReady':
      return (
        <div className={FilterDataWrapperStyle}>
          {(Object.entries(data): Array<any>).map(datumArr => {
            const [attr, datum] = datumArr;
            return (
              <button
                key={datum.id ? datum.id : uuid()}
                className={FilterDataStyle}
                type="button"
                onClick={() => onClick(null, attr)}
              >
                {datum}
                <Icon icon="CLEAR" />
              </button>
            );
          })}
        </div>
      );
  }
};

export default FilterData;
