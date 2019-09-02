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
import { isNullOrUndefined } from 'utils/fp';
import { calculateMilestonesEstimatedCompletionDate } from 'utils/project';
import {
  AutoDateBackgroundStyle,
  RadioWrapperStyle,
  AutoDateWrapperStyle,
  dateBindingSignWrapperStyle,
  AutoDateSyncIconStyle,
} from './style';

type Props = {
  originalValues: Object,
  values: Object,
  validator: any,
  setFieldValue: Function,
};

const DateBindingInput = ({ originalValues, values, validator, setFieldValue }: Props) => {
  const editable = true;

  let dateBinding = false;
  let dateBindingValue = 0;
  let dateBindingMetric = 'days';
  let dateBindingSign = 'before';
  let { estimatedCompletionDate } = values;
  if (values.estimatedCompletionDateBinding) {
    dateBinding = true;

    const {
      project: { milestones },
    } = values;
    const milestoneIndex = milestones.findIndex(item => item.id === values.id);
    const estimatedCompletionDates = calculateMilestonesEstimatedCompletionDate({ milestones });
    estimatedCompletionDate = estimatedCompletionDates[milestoneIndex];

    const { months, weeks, days } = values.estimatedCompletionDateInterval || {};
    if (!isNullOrUndefined(months)) {
      dateBindingValue = Math.abs(months);
      dateBindingMetric = 'months';
      dateBindingSign = months > 0 ? 'after' : 'before';
    } else if (!isNullOrUndefined(weeks)) {
      dateBindingValue = Math.abs(weeks);
      dateBindingMetric = 'weeks';
      dateBindingSign = weeks > 0 ? 'after' : 'before';
    } else if (!isNullOrUndefined(days)) {
      dateBindingValue = Math.abs(days);
      dateBindingMetric = 'days';
      dateBindingSign = days > 0 ? 'after' : 'before';
    }
  }

  return (
    <GridColumn gap="10px">
      <div className={AutoDateBackgroundStyle(dateBinding ? 'bottom' : 'top')} />

      <div className={RadioWrapperStyle('top')}>
        <RadioInput
          align="right"
          selected={!dateBinding}
          onToggle={() => {
            setFieldValue('estimatedCompletionDateBinding', null);
            setFieldValue('estimatedCompletionDateInterval', null);
          }}
          editable={editable}
        />
      </div>

      <div className={RadioWrapperStyle('bottom')}>
        <RadioInput
          align="right"
          selected={dateBinding}
          onToggle={() => {
            setFieldValue('estimatedCompletionDate', estimatedCompletionDate);
            setFieldValue('estimatedCompletionDateBinding', 'MilestoneCompleteDate');
            setFieldValue('estimatedCompletionDateInterval', { days: 0 });
          }}
          editable={editable}
        />
      </div>

      <FormField
        name="estimatedCompletionDate"
        initValue={estimatedCompletionDate}
        values={values}
        validator={validator}
        setFieldValue={setFieldValue}
      >
        {({ name, ...inputHandlers }) => (
          <DateInputFactory
            name={name}
            {...inputHandlers}
            originalValue={originalValues[name]}
            editable={editable && !dateBinding}
          />
        )}
      </FormField>

      {dateBinding ? (
        <div className={AutoDateWrapperStyle}>
          <div className={AutoDateSyncIconStyle}>
            <Icon icon="SYNC" />
          </div>

          <div className={dateBindingSignWrapperStyle}>
            <FormField
              name="autoDueDateDuration"
              initValue={{
                metric: dateBindingMetric,
                value: dateBindingValue,
              }}
              setFieldValue={(field, newValue) => {
                const { value, metric } = newValue;
                setFieldValue('estimatedCompletionDateInterval', {
                  [metric]: dateBindingSign === 'before' ? 0 - value : value,
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
                setFieldValue('estimatedCompletionDateInterval', {
                  [dateBindingMetric]: value === 'before' ? 0 - dateBindingValue : dateBindingValue,
                });
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
            name="estimatedCompletionDateBinding"
            initValue={values.estimatedCompletionDateBinding}
            setFieldValue={setFieldValue}
            saveOnChange
          >
            {({ ...inputHandlers }) => (
              <SelectInputFactory
                {...inputHandlers}
                items={[
                  {
                    value: 'MilestoneCompleteDate',
                    label: "Prev. Milestone's Est. / Compl.",
                  },
                ]}
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

export default DateBindingInput;
