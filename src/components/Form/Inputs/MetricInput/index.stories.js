/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { StringValue, ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { FieldItem, Label, DefaultStyle, MetricInput } from 'components/Form';

storiesOf('Form/Inputs/Metric Input', module).add('Metric Input', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <StringValue>
        {({ value: currentFocused, set: onFocus, clear: onBlur }) => {
          const INPUT_1 = 'EDITABLE';
          const INPUT_2 = 'READONLY';
          const INPUT_3 = 'READONLY (EMPTY)';

          return (
            <>
              <ObjectValue
                defaultValue={{
                  inputOne: {
                    value: 100,
                    metric: 'cm',
                  },
                }}
              >
                {({ value: { inputOne }, set }) => {
                  return (
                    <FieldItem
                      label={<Label>{INPUT_1}</Label>}
                      input={
                        <DefaultStyle isFocused={currentFocused === INPUT_1} type="number">
                          <MetricInput
                            name={INPUT_1}
                            placeholder="Editable"
                            onChange={e => set('inputOne', e.target.value)}
                            onFocus={() => onFocus(INPUT_1)}
                            onBlur={() => onBlur()}
                            value={inputOne}
                            metrics={['cm', 'm']}
                          />
                        </DefaultStyle>
                      }
                    />
                  );
                }}
              </ObjectValue>

              <FieldItem
                label={<Label>{INPUT_2}</Label>}
                input={<MetricInput value={{ value: 124, metric: 'm' }} readOnly />}
              />

              <FieldItem label={<Label>{INPUT_3}</Label>} input={<MetricInput readOnly />} />
            </>
          );
        }}
      </StringValue>
    </IntlProvider>
  </StoryBookWrapper>
));
