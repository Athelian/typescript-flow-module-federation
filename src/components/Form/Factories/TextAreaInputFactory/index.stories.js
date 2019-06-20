/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, TextAreaInputFactory } from 'components/Form';

storiesOf('Form/Inputs/TextArea Input', module).add('TextArea Input Factory', () => (
  <ObjectValue
    defaultValue={{
      isNew: false,
      initialValues: {
        inputTwo: 'Goodbye',
      },
      values: {
        inputTwo: 'Goodbye',
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
    {({ value: { isNew, initialValues, values, touchedFields, focusedField, user }, set }) => (
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
              <TextAreaInputFactory
                name={name}
                {...inputHandlers}
                isNew={isNew}
                originalValue={initialValues[name]}
                label="FORM MIMIC"
                editable={editable}
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
            </>
          );
        }}
      </ObjectValue>
    )}
  </ObjectValue>
));
