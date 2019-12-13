// @flow

import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import { ToggleInput, Label } from 'components/Form';
import NumberInput from 'components/Inputs/NumberInput';
import DateInput from 'components/Form/Inputs/DateInput';
import SelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SelectInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import Icon from 'components/Icon';
import messages from 'modules/task/messages';
import {
  TaskBindingInputWrapperStyle,
  DateInputWrapperStyle,
  BindingIconStyle,
  BindingToggleWrapperStyle,
  BindingInputsWrapperStyle,
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

const mappingOptions = {
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

const mappingOptionsByEntity = (entity: string, isStartDate: boolean) => {
  return [
    isStartDate ? BINDING_FIELDS.TaskDueDate : BINDING_FIELDS.TaskStartDate,
    BINDING_FIELDS.ProjectDueDate,
    BINDING_FIELDS.MilestoneDueDate,
    ...(mappingOptions?.[entity] ?? []),
  ];
};

const findDuration = ({
  months,
  weeks,
}: {
  months: ?number,
  weeks: ?number,
}): 'days' | 'weeks' | 'months' => {
  let duration = 'days';
  if (!Number.isNaN(months) && months !== undefined) {
    duration = 'months';
  } else if (!Number.isNaN(weeks) && weeks !== undefined) {
    duration = 'weeks';
  }
  return duration;
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
  const { months, weeks, days } = interval || {};
  const range = Math.abs(Number(months) || Number(weeks) || Number(days)) || 0;
  const duration = findDuration({ months, weeks });
  if ((months || weeks || days) > 0) {
    offset = 'after';
  }

  const itemToString = item => (item ? item.label : '');
  const itemToValue = item => (item ? item.value : '');

  const durationOptions = [
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
  ];

  const offsetOptions = [
    {
      label: 'Before',
      value: 'before',
    },
    { label: 'After', value: 'after' },
  ];

  return (
    <div className={TaskBindingInputWrapperStyle}>
      <div className={DateInputWrapperStyle(binding)}>
        <DateInput
          className={InputStyle}
          value={date}
          name="date"
          readOnly={readOnly || binding}
          readOnlyWidth="100%"
          readOnlyHeight="30px"
          onChange={evt => handleChange({ date: evt.target.value })}
        />
      </div>

      <div className={BindingIconStyle}>
        <Icon icon={binding ? 'BINDED' : 'UNBINDED'} />
      </div>

      <div className={BindingToggleWrapperStyle}>
        <ToggleInput
          toggled={binding}
          editable={!readOnly}
          onToggle={() => {
            if (binding) {
              handleChange({
                date,
                interval,
                binding: null,
              });
            } else {
              handleChange({
                date,
                binding:
                  type !== 'startDate' ? BINDING_FIELDS.TaskStartDate : BINDING_FIELDS.TaskDueDate,
              });
            }
          }}
        />
      </div>

      {binding ? (
        <div className={BindingInputsWrapperStyle}>
          <NumberInput
            name="range"
            className={InputStyle}
            value={range}
            required
            readOnly={!!readOnly}
            disabled={readOnly}
            onChange={evt => {
              const newInterval = {};
              newInterval[duration] =
                offset === 'after' ? Math.abs(evt.target.value) : -Math.abs(evt.target.value);
              handleChange({
                date,
                binding,
                interval: newInterval,
              });
            }}
          />

          <SelectInput
            name="offset"
            className={InputStyle}
            itemToString={itemToString}
            itemToValue={itemToValue}
            items={durationOptions}
            value={duration}
            onChange={changeDuration =>
              handleChange({
                date,
                binding,
                interval: {
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
            items={offsetOptions}
            value={offset}
            onChange={newOffset => {
              const newInterval = {};
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
            items={mappingOptionsByEntity(entity || 'Order', type === 'startDate').map(field => ({
              value: field,
              label: intl.formatMessage(messages[field]),
            }))}
            value={binding}
            onChange={(bindingField: string) =>
              handleChange({ binding: bindingField, date, interval })
            }
            readonly={!!readOnly}
            required
          />
        </div>
      ) : (
        <Label width="min-content">
          <FormattedMessage
            id="components.taskBindingInput.bindingOff"
            defaultMessage="BINDING OFF"
          />
        </Label>
      )}
    </div>
  );
}

export default BaseTaskBindingInput;
