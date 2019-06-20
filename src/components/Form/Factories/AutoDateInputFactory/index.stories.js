/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { FormField } from 'modules/form';
import {
  ToggleInput,
  Label,
  MetricInputFactory,
  SelectInputFactory,
  EnumSearchSelectInputFactory,
  FieldItem,
} from 'components/Form';
import { AutoDateWrapperStyle, AutoDateOffsetWrapperStyle } from './style';

const fieldValues = {
  autoDateDuration: { value: 20, metric: 'days' },
  autoDateOffset: 'before',
  autoDateField: { name: 'poNo', description: 'PO NO' },
};

storiesOf('Form/Inputs/Auto Date Input', module).add('Auto Date Input Factory', () => (
  <ObjectValue
    defaultValue={{
      isNew: false,
      editable: true,
      initialValues: { ...fieldValues },
      values: { ...fieldValues },
    }}
  >
    {({ value: { isNew, editable, initialValues, values }, set }) => (
      <>
        <FieldItem
          label={<Label>AUTO DATE</Label>}
          input={
            <div className={AutoDateWrapperStyle}>
              <div className={AutoDateOffsetWrapperStyle}>
                <FormField
                  name="autoDateDuration"
                  initValue={values.autoDateDuration}
                  setFieldValue={set}
                >
                  {({ name, ...inputHandlers }) => (
                    <MetricInputFactory
                      name={name}
                      metricType="duration"
                      metricSelectWidth="60px"
                      metricOptionWidth="65px"
                      inputWidth="135px"
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={initialValues.autoDateDuration}
                      editable={editable}
                      hideTooltip
                    />
                  )}
                </FormField>

                <FormField
                  name="autoDateOffset"
                  initValue={values.autoDateOffset}
                  setFieldValue={set}
                  saveOnChange
                >
                  {({ name, ...inputHandlers }) => (
                    <SelectInputFactory
                      name={name}
                      items={[
                        {
                          label: 'Before',
                          value: 'before',
                        },
                        { label: 'After', value: 'after' },
                      ]}
                      inputWidth="55px"
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={initialValues.autoDateOffset}
                      editable={editable}
                      required
                      hideDropdownArrow
                      hideTooltip
                    />
                  )}
                </FormField>
              </div>

              <FormField name="autoDateField" initValue={values.autoDateField} setFieldValue={set}>
                {({ name, ...inputHandlers }) => (
                  <EnumSearchSelectInputFactory
                    name={name}
                    enumType="TODO"
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={initialValues.autoDateField}
                    editable={editable}
                    required
                    hideTooltip
                  />
                )}
              </FormField>
            </div>
          }
        />
        <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
          <Label>EDITABLE</Label>
        </ToggleInput>
        <ToggleInput toggled={isNew} onToggle={() => set('isNew', !isNew)}>
          <Label>IS NEW</Label>
        </ToggleInput>
      </>
    )}
  </ObjectValue>
));
