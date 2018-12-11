// @flow
import React from 'react';
import { getByPath } from 'utils/fp';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { FilterDataWrapperStyle, FilterDataStyle } from './style';

type Props = {
  onClick: Function,
  field: ?string,
  name: string,
  data: any,
};
const FilterData = ({ onClick, field, data, name }: Props) => {
  if (!name) {
    return null;
  }
  switch (name) {
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
    case 'deliveryReady': {
      const { after: fromDate, before: toDate } = data;
      if (!fromDate && !toDate) {
        return null;
      }
      return (
        <div className={FilterDataWrapperStyle}>
          <button
            key={uuid()}
            className={FilterDataStyle}
            type="button"
            onClick={() => {
              if (fromDate) {
                onClick(null, 'after');
              }
              if (toDate) {
                onClick(null, 'before');
              }
            }}
          >
            {fromDate && <FormattedDate value={fromDate} />}
            {fromDate && !toDate && ' > '}
            {fromDate && toDate && ' - '}
            {!fromDate && toDate && ' < '}
            {toDate && <FormattedDate value={toDate} />}
            <Icon icon="CLEAR" />
          </button>
        </div>
      );
    }
    case 'price': {
      const {
        currency: { name: currencyName },
        min,
        max,
      } = data;
      if (currencyName === '' || (!min && !max)) return null;
      return (
        <div className={FilterDataWrapperStyle}>
          <button key={uuid()} className={FilterDataStyle} type="button">
            {min && <FormattedNumber value={min} suffix={currencyName} />}
            {' ~ '}
            {max && <FormattedNumber value={max} suffix={currencyName} />}
            <Icon icon="CLEAR" />
          </button>
        </div>
      );
    }
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
  }
};

export default FilterData;
