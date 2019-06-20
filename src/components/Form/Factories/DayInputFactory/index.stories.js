/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { ToggleInput, Label, DayInputFactory } from 'components/Form';

storiesOf('Form/Inputs/Day Input', module).add('Day Input Factory', () => (
  <>
    <ObjectValue
      defaultValue={{
        currentFocused: null,
        value: 100,
        originalValue: 100,
        readOnly: false,
        isNew: false,
      }}
    >
      {({
        value: { currentFocused, value, originalValue, readOnly, isNew },
        set: setFieldValue,
      }) => (
        <>
          <DayInputFactory
            name="inputOne"
            placeholder="Please input a value"
            onChange={e => setFieldValue('value', e.target.value)}
            onFocus={() => setFieldValue('currentFocused', 'inputOne')}
            onBlur={() => setFieldValue('currentFocused', null)}
            isNew={isNew}
            isFocused={currentFocused === 'inputOne'}
            readOnly={readOnly}
            value={value}
            originalValue={originalValue}
            label="BASIC"
            infoMessage="This is an info tooltip :)"
          />
          <ToggleInput toggled={readOnly} onToggle={() => setFieldValue('readOnly', !readOnly)}>
            <Label>READ ONLY</Label>
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
        nullable: false,
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
        value: { isNew, nullable, initialValues, values, touchedFields, focusedField, user },
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
            const readOnly = !!(user.role === 'default');

            return (
              <>
                <DayInputFactory
                  name={name}
                  {...inputHandlers}
                  isNew={isNew}
                  originalValue={initialValues[name]}
                  label="FORM MIMIC"
                  readOnly={readOnly}
                  placeholder="Please input a value"
                  nullable={nullable}
                />
                <ToggleInput
                  toggled={readOnly}
                  onToggle={() =>
                    set('user', {
                      ...user,
                      role: user.role === 'manager' ? 'default' : 'manager',
                    })
                  }
                >
                  <Label>READ ONLY</Label>
                </ToggleInput>
                <ToggleInput toggled={isNew} onToggle={() => set('isNew', !isNew)}>
                  <Label>IS NEW</Label>
                </ToggleInput>
                <ToggleInput toggled={nullable} onToggle={() => set('nullable', !nullable)}>
                  <Label>NULLABLE</Label>
                </ToggleInput>
              </>
            );
          }}
        </ObjectValue>
      )}
    </ObjectValue>
  </>
));
