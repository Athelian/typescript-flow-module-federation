/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import apolloClient from 'apollo';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ToggleInput, Label } from 'components/Form';
import { EnumSearchSelectInputFactory } from 'modules/form/factories';

storiesOf('Form/Inputs/Enum Search Select Input', module).add(
  'Enum Search Select Input Factory',
  () => (
    <StoryBookWrapper>
      <ApolloProvider client={apolloClient}>
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
                onChange: newValue => set('values', { ...values, inputTwo: newValue }),
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
                    <EnumSearchSelectInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={initialValues[name]}
                      label="FORM MIMIC"
                      readOnly={readOnly}
                      placeholder="Please input a value"
                      enumType="Seaport"
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
                  </>
                );
              }}
            </ObjectValue>
          )}
        </ObjectValue>
      </ApolloProvider>
    </StoryBookWrapper>
  )
);
