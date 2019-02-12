/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ToggleInput, Label } from 'components/Form';
import { MetricInputFactory } from 'modules/form/factories';

storiesOf('Form/Inputs/Metric Input', module).add('Metric Input Factory', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <>
        <ObjectValue
          defaultValue={{
            currentFocused: null,
            value: {
              value: 100,
              metric: 'cm',
            },
            originalValue: {
              value: 100,
              metric: 'cm',
            },
            readOnly: false,
            isNew: false,
          }}
        >
          {({
            value: { currentFocused, value, originalValue, readOnly, isNew },
            set: setFieldValue,
          }) => (
            <>
              <MetricInputFactory
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
                metricType="distance"
                inputHeight="20px"
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
            showCalculator: false,
            metricType: 'distance',
            initialValues: {
              inputTwo: {
                value: 200,
                metric: 'cm',
              },
            },
            values: {
              inputTwo: {
                value: 200,
                metric: 'cm',
              },
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
              showCalculator,
              metricType,
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
                const readOnly = !!(user.role === 'default');

                return (
                  <>
                    <MetricInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={initialValues[name]}
                      label="FORM MIMIC"
                      readOnly={readOnly}
                      placeholder="Please input a value"
                      metricType={metricType}
                      showCalculator={showCalculator}
                      onCalculate={() =>
                        set('values', { ...values, inputTwo: { ...values.inputTwo, value: 999 } })
                      }
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
                    <ToggleInput
                      toggled={showCalculator}
                      onToggle={() => set('showCalculator', !showCalculator)}
                    >
                      <Label>CALCULATOR</Label>
                    </ToggleInput>
                    <ToggleInput
                      toggled={metricType === 'distance'}
                      onToggle={() => set('metricType', 'distance')}
                    >
                      <Label>DISTANCE</Label>
                    </ToggleInput>
                    <ToggleInput
                      toggled={metricType === 'area'}
                      onToggle={() => set('metricType', 'area')}
                    >
                      <Label>AREA</Label>
                    </ToggleInput>
                    <ToggleInput
                      toggled={metricType === 'volume'}
                      onToggle={() => set('metricType', 'volume')}
                    >
                      <Label>VOLUME</Label>
                    </ToggleInput>
                    <ToggleInput
                      toggled={metricType === 'weight'}
                      onToggle={() => set('metricType', 'weight')}
                    >
                      <Label>WEIGHT</Label>
                    </ToggleInput>
                  </>
                );
              }}
            </ObjectValue>
          )}
        </ObjectValue>
      </>
    </IntlProvider>
  </StoryBookWrapper>
));
