// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import {
  DateInputFactory,
  RadioInput,
  MetricInputFactory,
  SelectInputFactory,
  Display,
} from 'components/Form';
import { FormField } from 'modules/form';
import { calculateBindingDate } from 'utils/project';
import {
  AutoDateBackgroundStyle,
  RadioWrapperStyle,
  AutoDateWrapperStyle,
  dateBindingSignWrapperStyle,
  AutoDateSyncIconStyle,
} from './style';

type OptionalProps = {
  editable: boolean,
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
  editable: false,
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
  editable,
}: Props) => {
  const [dateBindingSign, setDateBindingSign] = React.useState('before');

  let bound = false;
  let dateBindingValue = 0;
  let dateBindingMetric = 'days';
  let date = values[dateName];

  if (values[dateBinding]) {
    bound = true;

    date = calculateBindingDate(baseDate, values[dateInterval]);

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
      <div className={AutoDateBackgroundStyle(bound ? 'bottom' : 'top')} />

      <div className={RadioWrapperStyle('top')}>
        <RadioInput
          align="right"
          selected={!bound}
          onToggle={() => {
            setFieldValue(dateBinding, null);
            setFieldValue(dateInterval, null);
          }}
          editable={editable && bound}
        />
      </div>

      <div className={RadioWrapperStyle('bottom')}>
        <RadioInput
          align="right"
          selected={bound}
          onToggle={() => {
            setFieldValue(dateName, date);
            setFieldValue(dateBinding, dateBindingItems[0]?.value);
            setFieldValue(dateInterval, {
              days: 0,
            });
            setDateBindingSign('before');
          }}
          editable={editable && !bound}
        />
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
            editable={editable && !bound}
            hideTooltip={bound}
          />
        )}
      </FormField>

      {bound ? (
        <div className={AutoDateWrapperStyle}>
          <div className={AutoDateSyncIconStyle}>
            <Icon icon="SYNC" />
          </div>

          <div className={dateBindingSignWrapperStyle}>
            <FormField
              name={dateInterval}
              initValue={{
                metric: dateBindingMetric,
                value: dateBindingValue,
              }}
              setFieldValue={(field, newValue) => {
                const { value, metric } = newValue;
                setFieldValue(dateInterval, {
                  [metric]: dateBindingSign === 'before' ? -Math.abs(value) : Math.abs(value),
                });
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
                  editable={editable}
                  hideTooltip
                />
              )}
            </FormField>

            <FormField
              name="dateBindingSign"
              initValue={dateBindingSign}
              setFieldValue={(field, value) => {
                setFieldValue(dateInterval, {
                  [dateBindingMetric]:
                    value === 'before' ? -Math.abs(dateBindingValue) : Math.abs(dateBindingValue),
                });
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
                  editable={editable}
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
                editable={editable}
                required
                hideTooltip
              />
            )}
          </FormField>
        </div>
      ) : (
        <Display color="GRAY_LIGHT" width="200px" height="30px">
          {editable ? (
            <FormattedMessage
              id="modules.milestone.chooseDataBinding"
              defaultMessage="Choose data to sync from"
            />
          ) : (
            <FormattedMessage
              id="modules.milestone.noEventBindingChosen"
              defaultMessage="No event binding chosen"
            />
          )}
        </Display>
      )}
    </GridColumn>
  );
};

DateBindingInput.defaultProps = defaultProps;

export default DateBindingInput;
