// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import EnumProvider from 'providers/enum';
import {
  FieldItem,
  Label,
  DefaultStyle,
  NumberInput,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
} from 'components/Form';
import { PriceRangeWrapperStyle, NumberInputsWrapperStyle } from './style';
import messages from '../messages';

export const parseEnumValue = (enumValue: ?string | ?{ name: string }) => {
  if (enumValue && enumValue.name) return enumValue.name;
  return enumValue;
};

export const parseEnumDescriptionOrValue = (
  enumValue: ?string | ?{ description: string, name: string }
) => {
  if (enumValue && enumValue.description) return enumValue.description;
  return parseEnumValue(enumValue);
};

export default function PriceRange() {
  return (
    <div className={PriceRangeWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.currency} />
          </Label>
        }
        input={
          <EnumProvider enumType="Currency">
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;

              return (
                <SearchSelectInput
                  items={data}
                  itemToString={item => (item ? item.description || item.name : '')}
                  itemToValue={item => (item ? item.name : '')}
                  renderSelect={({ ...rest }) => (
                    <DefaultSearchSelect
                      {...rest}
                      forceHoverStyle
                      width="200px"
                      itemToString={item => (item ? item.description || item.name : '')}
                    />
                  )}
                  renderOptions={({ ...rest }) => (
                    <DefaultOptions
                      {...rest}
                      items={data}
                      itemToString={item => (item ? item.description || item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      width="200px"
                    />
                  )}
                />
              );
            }}
          </EnumProvider>
        }
      />

      <div className={NumberInputsWrapperStyle}>
        <FieldItem
          vertical
          label={
            <Label>
              <FormattedMessage {...messages.min} />
            </Label>
          }
          input={
            <DefaultStyle type="number" forceHoverStyle>
              <NumberInput align="left" />
            </DefaultStyle>
          }
        />
        <FieldItem
          vertical
          label={
            <Label>
              <FormattedMessage {...messages.max} />
            </Label>
          }
          input={
            <DefaultStyle type="number" forceHoverStyle>
              <NumberInput align="left" />
            </DefaultStyle>
          }
        />
      </div>
    </div>
  );
}
