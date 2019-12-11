// @flow

import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import { findDuration } from 'utils/date';
import { ToggleInput } from 'components/Form';
import NumberInput from 'components/Inputs/NumberInput';
import DateInput from 'components/Form/Inputs/DateInput';
import SelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SelectInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import Icon from 'components/Icon';
import messages from './messages';
import {
  WrapperStyle,
  DateWrapperStyle,
  DateInputStyle,
  IconStyle,
  LabelStyle,
  ToggleStyle,
} from './style';

type State = {|
  interval?: ?IntervalInput,
  binding?: ?TaskDateBinding,
  date: ?string | ?Date,
|};

type Props = {|
  interval?: ?IntervalInput,
  binding?: ?TaskDateBinding,
  readOnly?: boolean,
  entity?: string,
  type?: string,
  date: string | Date,
  handleChange: (values: State) => void,
|};

const BINDING_FIELDS = {
  OrderIssuedAt: 'OrderIssuedAt',
  OrderDeliveryDate: 'OrderDeliveryDate',
  OrderItemOrderIssuedAt: 'OrderItemOrderIssuedAt',
  OrderItemOrderDeliveryDate: 'OrderItemOrderDeliveryDate',
  BatchDeliveredAt: 'BatchDeliveredAt',
  BatchDesiredAt: 'BatchDesiredAt',
  BatchProducedAt: 'BatchProducedAt',
  BatchExpiredAt: 'BatchExpiredAt',
  ShipmentBlDate: 'ShipmentBlDate',
  ShipmentBookingDate: 'ShipmentBookingDate',
  ShipmentCargoReady: 'ShipmentCargoReady',
  ShipmentLoadPortDeparture: 'ShipmentLoadPortDeparture',
  ShipmentFirstTransitPortArrival: 'ShipmentFirstTransitPortArrival',
  ShipmentFirstTransitPortDeparture: 'ShipmentFirstTransitPortDeparture',
  ShipmentSecondTransitPortArrival: 'ShipmentSecondTransitPortArrival',
  ShipmentSecondTransitPortDeparture: 'ShipmentSecondTransitPortDeparture',
  ShipmentDischargePortArrival: 'ShipmentDischargePortArrival',
  ShipmentCustomClearance: 'ShipmentCustomClearance',
  ShipmentWarehouseArrival: 'ShipmentWarehouseArrival',
  ShipmentDeliveryReady: 'ShipmentDeliveryReady',
  ProjectDueDate: 'ProjectDueDate',
  MilestoneDueDate: 'MilestoneDueDate',
  TaskStartDate: 'TaskStartDate',
  TaskDueDate: 'TaskDueDate',
};

const bindingOptionsByEntity = (entity: string, isStartDate: boolean) => {
  const options = {
    Order: [BINDING_FIELDS.OrderDeliveryDate, BINDING_FIELDS.OrderIssuedAt],
    Batch: [
      BINDING_FIELDS.BatchDeliveredAt,
      BINDING_FIELDS.BatchDesiredAt,
      BINDING_FIELDS.BatchProducedAt,
      BINDING_FIELDS.BatchExpiredAt,
    ],
    Shipment: [
      BINDING_FIELDS.ShipmentBlDate,
      BINDING_FIELDS.ShipmentBookingDate,
      BINDING_FIELDS.ShipmentCargoReady,
      BINDING_FIELDS.ShipmentLoadPortDeparture,
      BINDING_FIELDS.ShipmentFirstTransitPortArrival,
      BINDING_FIELDS.ShipmentFirstTransitPortDeparture,
      BINDING_FIELDS.ShipmentSecondTransitPortArrival,
      BINDING_FIELDS.ShipmentSecondTransitPortDeparture,
      BINDING_FIELDS.ShipmentDischargePortArrival,
      BINDING_FIELDS.ShipmentCustomClearance,
      BINDING_FIELDS.ShipmentWarehouseArrival,
      BINDING_FIELDS.ShipmentDeliveryReady,
    ],
  };

  return [
    isStartDate ? BINDING_FIELDS.TaskDueDate : BINDING_FIELDS.TaskStartDate,
    BINDING_FIELDS.ProjectDueDate,
    BINDING_FIELDS.MilestoneDueDate,
    ...(options?.[entity] ?? []),
  ];
};

function BaseTaskBindingInput({
  interval,
  binding,
  readOnly,
  entity,
  type,
  date,
  handleChange,
}: Props) {
  const intl = useIntl();
  let offset = 'before';
  const { months = 0, weeks = 0, days = 0 } = interval || {};
  const range = Math.abs(months || weeks || days);
  const duration = findDuration({ months, weeks });
  if ((months || weeks || days) > 0) {
    offset = 'after';
  }

  if (!binding) {
    return (
      <div className={WrapperStyle(!!readOnly)}>
        <div className={DateWrapperStyle(false)}>
          <DateInput
            className={InputStyle}
            value={date}
            name="date"
            readOnly={readOnly}
            readOnlyWidth="100%"
            readOnlyHeight="30px"
            onChange={evt => handleChange({ date: evt.target.value })}
          />
          <div className={IconStyle}>
            <Icon icon="UNBINDED" />
          </div>
        </div>
        <div className={ToggleStyle}>
          <ToggleInput
            toggled={false}
            editable={!readOnly}
            onToggle={() => {
              handleChange({
                date: '',
                binding:
                  type !== 'startDate' ? BINDING_FIELDS.TaskStartDate : BINDING_FIELDS.TaskDueDate,
              });
            }}
          />
        </div>
        <div className={LabelStyle}>
          <FormattedMessage
            id="components.taskBindingInput.bindingOff"
            defaultMessage="BINDING OFF"
          />
        </div>
      </div>
    );
  }

  const itemToString = item => (item ? item.label : '');
  const itemToValue = item => (item ? item.value : '');

  return (
    <div className={WrapperStyle(!!readOnly)}>
      <div className={DateWrapperStyle(true)}>
        <DateInput
          className={DateInputStyle}
          value={date}
          name="date"
          readOnly
          readOnlyWidth="100%"
          readOnlyHeight="30px"
        />
        <div className={IconStyle}>
          <Icon icon="BINDED" />
        </div>
      </div>
      <div className={ToggleStyle}>
        <ToggleInput
          toggled={!!binding}
          onToggle={() => {
            handleChange({
              date,
              interval,
              binding: null,
            });
          }}
          editable={!readOnly}
        />
      </div>
      <div className={LabelStyle}>
        <FormattedMessage id="components.taskBindingInput.binding" defaultMessage="BINDING" />
      </div>
      <NumberInput
        name="range"
        value={range}
        required
        readonly={!!readOnly}
        disabled={readOnly}
        onChange={evt => {
          const newInterval = { days: 0, weeks: 0, months: 0 };
          newInterval[duration] =
            offset === 'after' ? Math.abs(evt.target.value) : -Math.abs(evt.target.value);
          handleChange({
            date,
            binding,
            interval: newInterval,
          });
        }}
        className={InputStyle}
      />
      <SelectInput
        name="offset"
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={[
          {
            label: 'Days',
            value: 'days',
          },
          {
            label: 'Weeks',
            value: 'weeks',
          },
          {
            label: 'Months',
            value: 'months',
          },
        ]}
        value={duration}
        onChange={changeDuration =>
          handleChange({
            date,
            binding,
            interval: {
              days: 0,
              weeks: 0,
              months: 0,
              [changeDuration]: offset === 'after' ? Math.abs(range) : -Math.abs(range),
            },
          })
        }
        readonly={!!readOnly}
        required
      />
      <SelectInput
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={[
          {
            label: 'Before',
            value: 'before',
          },
          { label: 'After', value: 'after' },
        ]}
        value={offset}
        onChange={newOffset => {
          const newInterval = { days: 0, weeks: 0, months: 0 };
          newInterval[duration] = newOffset === 'after' ? Math.abs(range) : -Math.abs(range);
          handleChange({
            date,
            binding,
            interval: newInterval,
          });
        }}
        readonly={!!readOnly}
        required
      />
      <SelectInput
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={bindingOptionsByEntity(entity || 'Order', type === 'startDate').map(field => ({
          value: field,
          label: intl.formatMessage(messages[field]),
        }))}
        value={binding}
        onChange={(bindingField: string) => handleChange({ binding: bindingField, date, interval })}
        readonly={!!readOnly}
        required
      />
    </div>
  );
}

export default BaseTaskBindingInput;
