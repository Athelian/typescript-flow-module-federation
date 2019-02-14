/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import apolloClient from 'apollo';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ToggleInput, Label } from 'components/Form';
import { EnumSelectInputFactory } from 'modules/form/factories';

storiesOf('Form/Inputs/Enum Select Input', module).add('Enum Select Input Factory', () => (
  <StoryBookWrapper>
    <ApolloProvider client={apolloClient}>
      <>
        <ObjectValue
          defaultValue={{
            currentFocused: null,
            editable: false,
            isNew: false,
          }}
        >
          {({
            value: { currentFocused, value, originalValue, editable, isNew },
            set: setFieldValue,
          }) => (
            <>
              <EnumSelectInputFactory
                name="inputOne"
                placeholder="Please input a value"
                onChange={newValue => setFieldValue('value', newValue ? newValue.name : null)}
                onFocus={() => setFieldValue('currentFocused', 'inputOne')}
                onBlur={() => setFieldValue('currentFocused', null)}
                isNew={isNew}
                isFocused={currentFocused === 'inputOne'}
                editable={editable}
                value={value}
                originalValue={originalValue}
                label="BASIC"
                infoMessage="This is an info tooltip :)"
                enumType="BatchAdjustmentReason"
                type="label"
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
              inputTwo: null,
            },
            values: {
              inputTwo: null,
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
            value: { isNew, initialValues, values, touchedFields, focusedField, user },
            set,
          }) => (
            <ObjectValue
              value={{
                name: 'inputTwo',
                value: values.inputTwo,
                isTouched: touchedFields.inputTwo,
                isFocused: focusedField === 'inputTwo',
                onChange: newValue =>
                  set('values', { ...values, inputTwo: newValue ? newValue.name : null }),
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
                    <EnumSelectInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={initialValues[name]}
                      label="FORM MIMIC"
                      editable={editable}
                      placeholder="Please input a value"
                      enumType="Seaport"
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
    </ApolloProvider>
  </StoryBookWrapper>
));
