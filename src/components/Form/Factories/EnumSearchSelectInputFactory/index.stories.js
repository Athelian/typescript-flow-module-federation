/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, EnumSearchSelectInputFactory } from 'components/Form';

storiesOf('Form/Inputs/Enum Search Select Input', module).add(
  'Enum Search Select Input Factory',
  () => (
    <ObjectValue
      defaultValue={{
        editable: true,
        isNew: false,
        initialValues: {
          inputTwo: null,
        },
        values: {
          inputTwo: null,
        },
        touchedFields: {
          inputTwo: false,
        },
        focusedField: null,
      }}
    >
      {({
        value: { editable, isNew, initialValues, values, touchedFields, focusedField },
        set,
      }) => (
        <ObjectValue
          value={{
            name: 'inputTwo',
            value: values.inputTwo,
            isTouched: touchedFields.inputTwo,
            isFocused: focusedField === 'inputTwo',
            onChange: newValue => {
              set('values', { ...values, inputTwo: newValue.target.value });
            },
            onFocus: () => {
              if (!touchedFields.inputTwo) {
                set('touchedFields', { ...touchedFields, inputTwo: true });
              }
              set('focusedField', 'inputTwo');
            },
            onBlur: () => set('focusedField', null),
            errorMessage: null,
          }}
        >
          {({ value: { name, ...inputHandlers } }) => {
            return (
              <>
                <EnumSearchSelectInputFactory
                  name={name}
                  {...inputHandlers}
                  isNew={isNew}
                  originalValue={initialValues[name]}
                  label="FORM MIMIC"
                  editable={editable}
                  placeholder="Please input a value"
                  enumType="Seaport"
                />
                <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
                  <Label>editable</Label>
                </ToggleInput>
                <ToggleInput toggled={isNew} onToggle={() => set('isNew', !isNew)}>
                  <Label>IS NEW</Label>
                </ToggleInput>
              </>
            );
          }}
        </ObjectValue>
      )}
    </ObjectValue>
  )
);
