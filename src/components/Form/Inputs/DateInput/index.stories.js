/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { StringValue } from 'react-values';
import { FieldItem, Label, DefaultStyle, DateInput } from 'components/Form';

storiesOf('Form/Inputs/Date Input', module).add('Date Input', () => (
  <StringValue>
    {({ value: currentFocused, set: onFocus, clear: onBlur }) => {
      const INPUT_1 = 'EDITABLE';
      const INPUT_2 = 'READONLY';
      const INPUT_3 = 'READONLY (EMPTY)';

      return (
        <>
          <StringValue>
            {({ value, set }) => (
              <FieldItem
                label={<Label>{INPUT_1}</Label>}
                input={
                  <DefaultStyle isFocused={currentFocused === INPUT_1} type="date">
                    <DateInput
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
          </StringValue>

          <FieldItem
            label={<Label>{INPUT_2}</Label>}
            input={<DateInput value="2018-01-01" readOnly />}
          />

          <FieldItem label={<Label>{INPUT_3}</Label>} input={<DateInput readOnly />} />
        </>
      );
    }}
  </StringValue>
));
