/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, TextInputFactory } from 'components/Form';

storiesOf('Form/Inputs/Text Input', module).add('Text Input Factory', () => (
  <>
    <ObjectValue
      defaultValue={{
        currentFocused: null,
        value: 'Hello',
        originalValue: 'Hello',
        editable: false,
        isNew: false,
      }}
    >
      {({
        value: { currentFocused, value, originalValue, editable, isNew },
        set: setFieldValue,
      }) => (
        <>
          <TextInputFactory
            name="inputOne"
            placeholder="Please input a value"
            onChange={e => setFieldValue('value', e.target.value)}
            onFocus={() => setFieldValue('currentFocused', 'inputOne')}
            onBlur={() => setFieldValue('currentFocused', null)}
            isNew={isNew}
            isFocused={currentFocused === 'inputOne'}
            editable={editable}
            value={value}
            originalValue={originalValue}
            label="BASIC"
            infoMessage="This is an info tooltip :)"
          />
          <ToggleInput toggled={editable} onToggle={() => setFieldValue('editable', !editable)}>
            <Label>editable</Label>
          </ToggleInput>
          <ToggleInput toggled={isNew} onToggle={() => setFieldValue('isNew', !isNew)}>
            <Label>IS NEW</Label>
          </ToggleInput>
        </>
      )}
    </ObjectValue>

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
            const editable = !!(user.role === 'default');

            return (
              <>
                <TextInputFactory
                  name={name}
                  {...inputHandlers}
                  isNew={isNew}
                  originalValue={initialValues[name]}
                  label="FORM MIMIC"
                  editable={editable}
                  placeholder="Please input a value"
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
  </>
));
