// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import { isValidOfMetricRangeInput } from 'modules/relationMap/common/SortFilter/AdvancedFilter/utils';
import MetricInputItem from './components/MetricInputItem';
import PortItem from './components/PortItem';
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
            onClick={evt => {
              evt.stopPropagation();
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
            onClick={evt => {
              evt.stopPropagation();
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
    case 'seaports':
    case 'airports': {
      return (
        <div className={FilterDataWrapperStyle}>
          {data.loadPorts && (
            <PortItem
              name="loadPorts"
              onRemove={onRemove}
              ports={data.loadPorts}
              label={
                <FormattedMessage id="modules.relationMap.loadPort" defaultMessage="LOAD PORT" />
              }
            />
          )}
          {data.dischargePorts && (
            <PortItem
              name="dischargePorts"
              onRemove={onRemove}
              ports={data.dischargePorts}
              label={
                <FormattedMessage
                  id="modules.relationMap.dischargePort"
                  defaultMessage="DISCHARGE PORT"
                />
              }
            />
          )}
          {data.firstTransitPorts && (
            <PortItem
              name="secondTransitPorts"
              onRemove={onRemove}
              ports={data.firstTransitPorts}
              label={
                <FormattedMessage
                  id="modules.relationMap.firstTransitPort"
                  defaultMessage="FIRST TRANSIT PORT"
                />
              }
            />
          )}
          {data.secondTransitPorts && (
            <PortItem
              name="secondTransitPorts"
              onRemove={onRemove}
              ports={data.secondTransitPorts}
              label={
                <FormattedMessage
                  id="modules.relationMap.secondTransitPort"
                  defaultMessage="SECOND TRANSIT PORT"
                />
              }
            />
          )}
        </div>
      );
    }
    case 'totalVolume': {
      return (
        <div className={FilterDataWrapperStyle}>
          {isValidOfMetricRangeInput(data.value) && (
            <MetricInputItem {...data.value} onRemove={onRemove} name="value" />
          )}
        </div>
      );
    }
    case 'packaging': {
      return (
        <div className={FilterDataWrapperStyle}>
          {isValidOfMetricRangeInput(data.packageLength) && (
            <MetricInputItem
              {...data.packageLength}
              onRemove={onRemove}
              name="packageLength"
              label={<FormattedMessage id="packageLength" defaultMessage="PKG DEPTH" />}
            />
          )}
          {isValidOfMetricRangeInput(data.packageWidth) && (
            <MetricInputItem
              {...data.packageWidth}
              onRemove={onRemove}
              name="packageWidth"
              label={<FormattedMessage id="packageWidth" defaultMessage="PKG WIDTH" />}
            />
          )}
          {isValidOfMetricRangeInput(data.packageHeight) && (
            <MetricInputItem
              {...data.packageHeight}
              onRemove={onRemove}
              name="packageHeight"
              label={<FormattedMessage id="packageHeight" defaultMessage="PKG HEIGHT" />}
            />
          )}
          {isValidOfMetricRangeInput(data.packageVolume) && (
            <MetricInputItem
              {...data.packageVolume}
              onRemove={onRemove}
              name="packageVolume"
              label={<FormattedMessage id="packageVolume" defaultMessage="PKG VOLUME" />}
            />
          )}
          {isValidOfMetricRangeInput(data.packageWeight) && (
            <MetricInputItem
              {...data.packageWeight}
              onRemove={onRemove}
              name="packageWeight"
              label={<FormattedMessage id="packageWeight" defaultMessage="PKG WEIGHT" />}
            />
          )}
        </div>
      );
    }
    case 'inCharge':
      return (
        <div className={FilterDataWrapperStyle}>
          {data.map(user => (
            <button
              key={user.id}
              className={FilterDataStyle}
              type="button"
              onClick={evt => {
                evt.stopPropagation();
                onRemove(user);
              }}
            >
              <FormattedName firstName={user.firstName} lastName={user.lastName} />
              <Icon icon="CLEAR" />
            </button>
          ))}
        </div>
      );
    default:
      return (
        <div className={FilterDataWrapperStyle}>
          {data.map(datum =>
            isNullOrUndefined(datum) ? null : (
              <button
                key={{}.hasOwnProperty.call(datum, 'id') ? datum.id : uuid()}
                className={FilterDataStyle}
                type="button"
                onClick={evt => {
                  evt.stopPropagation();
                  onRemove(datum);
                }}
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
