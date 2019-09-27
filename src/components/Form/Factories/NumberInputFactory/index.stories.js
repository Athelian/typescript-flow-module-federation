/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, NumberInputFactory } from 'components/Form';

storiesOf('Form/Inputs/Number Input', module).add('Number Input Factory', () => (
  <ObjectValue
    defaultValue={{
      isNew: false,
      nullable: false,

      showExtraToggleButton: false,
      initialValues: {
        inputTwo: 200,
      },
      values: {
        inputTwo: 200,
      },
      touchedFields: {
        inputTwo: false,
      },
      focusedField: null,
      user: {
        role: 'manager',
      },
    }}
  >
    {({
      value: {
        isNew,
        nullable,

        showExtraToggleButton,
        initialValues,
        values,
        touchedFields,
        focusedField,
        user,
      },
      set,
    }) => (
      <ObjectValue
        value={{
          name: 'inputTwo',
          value: values.inputTwo,
          isTouched: touchedFields.inputTwo,
          isFocused: focusedField === 'inputTwo',
          onChange: e => set('values', { ...values, inputTwo: e.target.value }),
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
          const editable = !(user.role === 'default');

          return (
            <>
              <NumberInputFactory
                name={name}
                {...inputHandlers}
                isNew={isNew}
                originalValue={initialValues[name]}
                label="FORM MIMIC"
                editable={editable}
                placeholder="Please input a value"
                nullable={nullable}
                showExtraToggleButton={showExtraToggleButton}
                onToggleAutoCalculate={() => {}}
                autoCalculateIsToggled={false}
              />
              <ToggleInput
                toggled={editable}
                onToggle={() =>
                  set('user', {
                    ...user,
                    role: user.role === 'manager' ? 'default' : 'manager',
                  })
                }
              >
                <Label>EDITABLE</Label>
              </ToggleInput>
              <ToggleInput toggled={isNew} onToggle={() => set('isNew', !isNew)}>
                <Label>IS NEW</Label>
              </ToggleInput>
              <ToggleInput toggled={nullable} onToggle={() => set('nullable', !nullable)}>
                <Label>NULLABLE</Label>
              </ToggleInput>

              <ToggleInput
                toggled={showExtraToggleButton}
                onToggle={() => set('showExtraToggleButton', !showExtraToggleButton)}
              >
                <Label>AUTO CALCULATE</Label>
              </ToggleInput>
            </>
          );
        }}
      </ObjectValue>
    )}
  </ObjectValue>
));
