/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { StringValue, NumberValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { FieldItem, Label, DefaultStyle, NumberInput } from 'components/Form';

storiesOf('Form/Inputs/Number Input', module).add('Number Input', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <StringValue>
        {({ value: currentFocused, set: onFocus, clear: onBlur }) => {
          const INPUT_1 = 'EDITABLE (NOT NULLABLE)';
          const INPUT_2 = 'EDITABLE (NULLABLE)';
          const INPUT_3 = 'READONLY';
          const INPUT_4 = 'READONLY (EMPTY)';

          return (
            <>
              <NumberValue defaultValue={0}>
                {({ value, set }) => (
                  <FieldItem
                    label={<Label>{INPUT_1}</Label>}
                    input={
                      <DefaultStyle isFocused={currentFocused === INPUT_1} type="number">
                        <NumberInput
                          name={INPUT_1}
                          onChange={e => set(e.target.value)}
                          onFocus={() => onFocus(INPUT_1)}
                          onBlur={() => onBlur()}
                          value={value}
                        />
                      </DefaultStyle>
                    }
                  />
                )}
              </NumberValue>

              <NumberValue defaultValue="">
                {({ value, set }) => (
                  <FieldItem
                    label={<Label>{INPUT_2}</Label>}
                    input={
                      <DefaultStyle isFocused={currentFocused === INPUT_2} type="number">
                        <NumberInput
                          name={INPUT_2}
                          onChange={e => set(e.target.value)}
                          onFocus={() => onFocus(INPUT_2)}
                          onBlur={() => onBlur()}
                          value={value}
                          nullable
                        />
                      </DefaultStyle>
                    }
                  />
                )}
              </NumberValue>

              <FieldItem
                label={<Label>{INPUT_3}</Label>}
                input={<NumberInput value={123456} readOnly />}
              />

              <FieldItem label={<Label>{INPUT_4}</Label>} input={<NumberInput readOnly />} />
            </>
          );
        }}
      </StringValue>
    </IntlProvider>
  </StoryBookWrapper>
));
