/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { StringValue } from 'react-values';
import { FieldItem, Label, DefaultStyle, TextInput } from 'components/Form';

storiesOf('Form/Inputs/Text Input', module).add('Text Input', () => (
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
                  <DefaultStyle isFocused={currentFocused === INPUT_1}>
                    <TextInput
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
            input={<TextInput value="Hello" readOnly readOnlyHeight="30px" />}
          />

          <FieldItem
            label={<Label>{INPUT_3}</Label>}
            input={<TextInput readOnly readOnlyHeight="30px" />}
          />
        </>
      );
    }}
  </StringValue>
));
