/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { StringValue } from 'react-values';
import { FieldItem, Label, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';

storiesOf('Form/Inputs/Select Input', module).add('Select Input', () => (
  <StringValue>
    {({ set: onFocus, clear: onBlur }) => {
      const INPUT_1 = 'EDITABLE';
      const INPUT_2 = 'READONLY';
      const INPUT_3 = 'READONLY (EMPTY)';

      return (
        <>
          <StringValue defaultValue="optionA">
            {({ value, set }) => (
              <FieldItem
                label={<Label>{INPUT_1}</Label>}
                input={
                  <SelectInput
                    value={value}
                    name={INPUT_1}
                    onChange={newValue => set(newValue ? newValue.value : null)}
                    onFocus={() => onFocus(INPUT_1)}
                    onBlur={() => onBlur()}
                    items={[
                      { value: 'optionA', display: 'Option A' },
                      { value: 'optionB', display: 'Option B' },
                    ]}
                    itemToString={item => (item ? item.display || item : '')}
                    itemToValue={item => (item ? item.value : '')}
                    renderSelect={({ ...rest }) => <DefaultSelect {...rest} width="200px" />}
                    renderOptions={({ ...rest }) => <DefaultOptions {...rest} width="200px" />}
                  />
                }
              />
            )}
          </StringValue>

          <FieldItem
            label={<Label>{INPUT_2}</Label>}
            input={
              <SelectInput
                value="optionA"
                itemToString={item => (item ? item.display : '')}
                itemToValue={item => (item ? item.value : '')}
                readOnly
                readOnlyHeight="30px"
                items={[
                  { value: 'optionA', display: 'Option A' },
                  { value: 'optionB', display: 'Option B' },
                ]}
              />
            }
          />

          <FieldItem
            label={<Label>{INPUT_3}</Label>}
            input={
              <SelectInput
                value={null}
                itemToString={item => (item ? item.display : '')}
                readOnly
                readOnlyHeight="30px"
              />
            }
          />
        </>
      );
    }}
  </StringValue>
));
