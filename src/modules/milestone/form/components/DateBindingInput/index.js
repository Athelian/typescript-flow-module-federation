// @flow
import React from 'react';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import {
  DateInputFactory,
  MetricInputFactory,
  SelectInputFactory,
  ToggleInput,
} from 'components/Form';
import { FormField } from 'modules/form';
import { calculateBindingDate } from 'utils/date';
import useUser from 'hooks/useUser';
import {
  AutoDateWrapperStyle,
  DateBindingSignWrapperStyle,
  BindingToggleButtonStyle,
  IconStyle,
} from './style';

type OptionalProps = {
  manualEditable: boolean,
  bindingEditable: boolean,
};

type Props = OptionalProps & {
  dateName: string,
  dateBinding: string,
  dateBindingItems: Array<Object>,
  dateInterval: string,
  baseDate: string,
  originalValues: Object,
  values: Object,
  validator: any,
  setFieldValue: Function,
};

const defaultProps = {
  manualEditable: false,
  bindingEditable: false,
};

// only used at milestone form
const DateBindingInput = ({
  dateName,
  dateBinding,
  dateBindingItems,
  dateInterval,
  baseDate,
  originalValues,
  values,
  validator,
  setFieldValue,
  manualEditable,
  bindingEditable,
}: Props) => {
  const [dateBindingSign, setDateBindingSign] = React.useState('before');
  const { user } = useUser();

  let bound = false;
  let dateBindingValue = 0;
  let dateBindingMetric = 'days';
  let date = values[dateName];

  if (values[dateBinding]) {
    bound = true;
    date = calculateBindingDate(baseDate, values[dateInterval], user.timezone);

    const { months, weeks, days } = values[dateInterval] || {};
    if (months) {
      if (months > 0 && dateBindingSign === 'before') {
        setDateBindingSign('after');
      }
      dateBindingValue = Math.abs(months);
      dateBindingMetric = 'months';
    } else if (weeks) {
      if (weeks > 0 && dateBindingSign === 'before') {
        setDateBindingSign('after');
      }
      dateBindingValue = Math.abs(weeks);
      dateBindingMetric = 'weeks';
    } else if (days) {
      if (days > 0 && dateBindingSign === 'before') {
        setDateBindingSign('after');
      }
      dateBindingValue = Math.abs(days);
      dateBindingMetric = 'days';
    } else {
      dateBindingValue = 0;
      dateBindingMetric = 'days';
    }
  }

  return (
    <GridColumn gap="10px">
      <div className={BindingToggleButtonStyle}>
        <ToggleInput
          toggled={bound}
          onToggle={() => {
            if (bound) {
              setFieldValue(dateName, date);
              setFieldValue(dateBinding, null);
              setFieldValue(dateInterval, null);
            } else {
              setFieldValue(dateBinding, dateBindingItems[0]?.value);
              setFieldValue(dateInterval, {
                days: 0,
              });
              setFieldValue(dateName, calculateBindingDate(baseDate, { days: 0 }, user.timezone));
              setDateBindingSign('before');
            }
          }}
          editable={bindingEditable}
        >
          <div className={IconStyle}>
            <Icon icon={bound ? 'BINDED' : 'UNBINDED'} />
          </div>
        </ToggleInput>
      </div>

      <FormField
        name={dateName}
        initValue={date}
        values={values}
        validator={validator}
        setFieldValue={setFieldValue}
      >
        {({ name, ...inputHandlers }) => (
          <DateInputFactory
            name={name}
            {...inputHandlers}
            originalValue={originalValues[name]}
            editable={manualEditable && !bound}
            hideTooltip={bound}
            handleTimezone
          />
        )}
      </FormField>

      {bound && (
        <div className={AutoDateWrapperStyle}>
          <div className={DateBindingSignWrapperStyle}>
            <FormField
              name={dateInterval}
              initValue={{
                metric: dateBindingMetric,
                value: dateBindingValue,
              }}
              setFieldValue={(field, newValue) => {
                const { value, metric } = newValue;
                const realValue = dateBindingSign === 'before' ? -Math.abs(value) : Math.abs(value);
                setFieldValue(dateInterval, {
                  [metric]: realValue,
                });
                setFieldValue(
                  dateName,
                  calculateBindingDate(baseDate, { [metric]: realValue }, user.timezone)
                );
              }}
            >
              {({ name, ...inputHandlers }) => (
                <MetricInputFactory
                  name={name}
                  metricType="duration"
                  metricSelectWidth="60px"
                  metricOptionWidth="65px"
                  inputWidth="135px"
                  {...inputHandlers}
                  editable={bindingEditable}
                  hideTooltip
                />
              )}
            </FormField>

            <FormField
              name="dateBindingSign"
              initValue={dateBindingSign}
              setFieldValue={(field, value) => {
                const realValue =
                  value === 'before' ? -Math.abs(dateBindingValue) : Math.abs(dateBindingValue);
                setFieldValue(dateInterval, {
                  /* $FlowFixMe This comment suppresses an error found when
                   * upgrading Flow to v0.111.0. To view the error, delete this
                   * comment and run Flow. */
                  [dateBindingMetric]: realValue,
                });
                setFieldValue(
                  dateName,
                  /* $FlowFixMe This comment suppresses an error found when
                   * upgrading Flow to v0.111.0. To view the error, delete this
                   * comment and run Flow. */
                  calculateBindingDate(baseDate, { [dateBindingMetric]: realValue }, user.timezone)
                );
                setDateBindingSign(value);
              }}
              saveOnChange
            >
              {({ ...inputHandlers }) => (
                <SelectInputFactory
                  items={[
                    {
                      label: 'Before',
                      value: 'before',
                    },
                    { label: 'After', value: 'after' },
                  ]}
                  inputWidth="55px"
                  {...inputHandlers}
                  editable={bindingEditable}
                  required
                  hideDropdownArrow
                  hideTooltip
                />
              )}
            </FormField>
          </div>

          <FormField
            name={dateBinding}
            initValue={values[dateBinding]}
            setFieldValue={setFieldValue}
            saveOnChange
          >
            {({ ...inputHandlers }) => (
              <SelectInputFactory
                {...inputHandlers}
                items={dateBindingItems}
                editable={bindingEditable}
                required
                hideTooltip
              />
            )}
          </FormField>
        </div>
      )}
    </GridColumn>
  );
};

DateBindingInput.defaultProps = defaultProps;

export default DateBindingInput;
