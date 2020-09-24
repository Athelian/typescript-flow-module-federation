// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { IntervalInput, MilestoneDateBinding, TaskDateBinding } from 'generated/graphql';
import Icon from 'components/Icon';
import NumberInput from 'components/Inputs/NumberInput';
import { Label, ToggleInput } from 'components/Form';
import DateInput from 'components/Form/Inputs/DateInput';
import useUser from 'hooks/useUser';
import { formatDatetimeQueryToDatetimeWithTimezone, removeTimezone, addTimezone } from 'utils/date';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import SelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SelectInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import {
  BindingIconStyle,
  BindingInputsWrapperStyle,
  BindingToggleWrapperStyle,
  DateInputWrapperStyle,
  TaskBindingInputWrapperStyle,
} from './style';

type DateBinding = {
  binding: ?(TaskDateBinding | MilestoneDateBinding),
  interval: ?IntervalInput,
  date: ?(string | Date),
};

type Binding = {
  label: string,
  value: TaskDateBinding | MilestoneDateBinding,
};

const DURATIONS = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
];

const OFFSETS = [
  { label: 'Before', value: 'before' },
  { label: 'After', value: 'after' },
];

const itemToString = item => (item ? item.label : '');
const itemToValue = item => (item ? item.value : '');

const DateBindingInputTZ = ({
  value,
  context,
  readonly,
  onChange,
}: InputProps<DateBinding, Array<Binding>>) => {
  const { user } = useUser();
  const { date = null, binding = null, interval = null } = value || {};

  const { intervalValue, intervalUnit, intervalOffset } = React.useMemo(() => {
    const { months, weeks, days } = interval || {};
    let iValue = 0;
    let iUnit = 'days';
    if (!Number.isNaN(months) && (months > 0 || months < 0)) {
      iUnit = 'months';
      iValue = months;
    } else if (!Number.isNaN(weeks) && (weeks > 0 || weeks < 0)) {
      iUnit = 'weeks';
      iValue = weeks;
    } else if (!Number.isNaN(days) && (days > 0 || days < 0)) {
      iUnit = 'days';
      iValue = days;
    } else if (days !== undefined) {
      iUnit = 'days';
      iValue = days;
    } else if (months !== undefined) {
      iUnit = 'months';
      iValue = months;
    } else if (weeks !== undefined) {
      iUnit = 'weeks';
      iValue = weeks;
    }

    const sign = Math.sign(iValue);

    return {
      intervalValue: Math.abs(iValue),
      intervalUnit: iUnit,
      intervalOffset: Object.is(sign, 0) || Object.is(sign, 1) ? 'after' : 'before',
    };
  }, [interval]);

  return (
    <div className={TaskBindingInputWrapperStyle}>
      <div className={DateInputWrapperStyle(!!binding)}>
        <DateInput
          className={InputStyle}
          value={removeTimezone(
            formatDatetimeQueryToDatetimeWithTimezone(date, user.timezone),
            true
          )}
          name="date"
          readOnly={readonly || !!binding}
          readOnlyWidth="100%"
          readOnlyHeight="30px"
          onChange={evt => {
            const newDate = addTimezone(evt.target.value, user.timezone, true);

            onChange({
              date: newDate,
              interval: null,
              binding: null,
            });
          }}
        />
      </div>

      <div className={BindingIconStyle}>
        <Icon icon={binding ? 'BINDED' : 'UNBINDED'} />
      </div>

      <div className={BindingToggleWrapperStyle}>
        <ToggleInput
          toggled={!!binding}
          editable={!readonly}
          onToggle={() => {
            if (binding) {
              onChange({
                date,
                interval: null,
                binding: null,
              });
            } else {
              onChange({
                date,
                interval: { days: 0 },
                binding: context?.[0]?.value ?? null,
              });
            }
          }}
        />
      </div>

      {binding ? (
        <div className={BindingInputsWrapperStyle}>
          <NumberInput
            className={InputStyle}
            value={intervalValue}
            required
            readOnly={!!readonly}
            disabled={readonly}
            onChange={evt =>
              onChange({
                date,
                binding,
                interval: {
                  [(intervalUnit: string)]:
                    intervalOffset === 'after'
                      ? Math.abs(evt.target.value)
                      : -Math.abs(evt.target.value),
                },
              })
            }
          />

          <SelectInput
            className={InputStyle}
            value={intervalUnit}
            readonly={!!readonly}
            required
            itemToString={itemToString}
            itemToValue={itemToValue}
            items={DURATIONS}
            onChange={newIntervalUnit =>
              onChange({
                date,
                binding,
                interval: {
                  [newIntervalUnit]: intervalOffset === 'after' ? intervalValue : -intervalValue,
                },
              })
            }
          />

          <SelectInput
            className={InputStyle}
            value={intervalOffset}
            readonly={!!readonly}
            required
            itemToString={itemToString}
            itemToValue={itemToValue}
            items={OFFSETS}
            onChange={newOffset =>
              onChange({
                date,
                binding,
                interval: {
                  [(intervalUnit: string)]: newOffset === 'after' ? intervalValue : -intervalValue,
                },
              })
            }
          />

          <SelectInput
            className={InputStyle}
            value={binding}
            readonly={!!readonly}
            required
            itemToString={itemToString}
            itemToValue={itemToValue}
            items={context || []}
            onChange={newBinding => onChange({ binding: newBinding, date, interval })}
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
};

export default DateBindingInputTZ;
