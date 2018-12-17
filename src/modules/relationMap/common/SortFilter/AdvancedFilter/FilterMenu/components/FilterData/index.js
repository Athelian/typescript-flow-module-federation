// @flow
import React from 'react';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { FilterDataWrapperStyle, FilterDataStyle } from './style';

type Props = {
  onRemove: Function,
  field: ?string,
  name: string,
  data: any,
};
const FilterData = ({ onRemove, field, data, name }: Props) => {
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
                onRemove(null, 'after');
              }
              if (toDate) {
                onRemove(null, 'before');
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
      const { currency, min, max } = data;
      if (isNullOrUndefined(currency) && isNullOrUndefined(min) && isNullOrUndefined(max))
        return null;
      return (
        <div className={FilterDataWrapperStyle}>
          <button
            key={uuid()}
            className={FilterDataStyle}
            type="button"
            onClick={() => {
              if (currency) {
                onRemove(null, 'currency');
              }
              if (min) {
                onRemove(null, 'min');
              }
              if (max) {
                onRemove(null, 'max');
              }
            }}
          >
            {isNullOrUndefined(min) &&
              isNullOrUndefined(max) &&
              !isNullOrUndefined(currency) &&
              `${currency.name}`}
            {!isNullOrUndefined(min) && (
              <FormattedNumber
                value={min}
                suffix={!isNullOrUndefined(currency) ? currency.name : ''}
              />
            )}
            {!isNullOrUndefined(min) && isNullOrUndefined(max) && ' > '}
            {!isNullOrUndefined(min) && !isNullOrUndefined(max) && ' - '}
            {isNullOrUndefined(min) && !isNullOrUndefined(max) && ' < '}
            {!isNullOrUndefined(max) && (
              <FormattedNumber
                value={max}
                suffix={!isNullOrUndefined(currency) ? currency.name : ''}
              />
            )}
            <Icon icon="CLEAR" />
          </button>
        </div>
      );
    }
    case 'packaging': {
      console.log(data);
      return (
        <div className={FilterDataWrapperStyle}>
          <button className={FilterDataStyle} type="button" onClick={() => console.log(data)}>
            test
            <Icon icon="CLEAR" />
          </button>
        </div>
      );
    }
    default:
      return (
        <div className={FilterDataWrapperStyle}>
          {data.map(datum =>
            isNullOrUndefined(datum) ? null : (
              <button
                key={{}.hasOwnProperty.call(datum, 'id') ? datum.id : uuid()}
                className={FilterDataStyle}
                type="button"
                onClick={() => onRemove(datum)}
              >
                {field && getByPath(field, datum)}
                <Icon icon="CLEAR" />
              </button>
            )
          )}
        </div>
      );
  }
};

export default FilterData;
