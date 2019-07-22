/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, EnumSearchSelectInputFactory } from 'components/Form';

storiesOf('Form/Inputs/Enum Search Select Input', module)
  .add('Currency - required field', () => (
    <ObjectValue
      defaultValue={{
        editable: true,
        isNew: false,
        initialValues: {
          inputTwo: 'USD',
        },
        values: {
          inputTwo: 'USD',
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
                  {...inputHandlers}
                  name={name}
                  hideClearButton
                  required
                  isNew={isNew}
                  originalValue={initialValues[name]}
                  label="Currency"
                  editable={editable}
                  placeholder="Please input a value"
                  enumType="Currency"
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
  ))
  .add('Load port - optional field', () => (
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
                  label="Port"
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
  ));
