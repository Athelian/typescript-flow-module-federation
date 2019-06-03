// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import EnumProvider from 'providers/enum';
import { parseEnumValue, parseEnumDescriptionOrValue } from 'components/Form/Factories/helpers';
import enumMessages from 'components/Form/Factories/messages';
import { FieldItem, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';
import { useTextInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
  width: string,
  height: string,
  forceHoverStyle: boolean,
  value: string,
};

type Props = OptionalProps & {
  intl: IntlShape,
  enumType: 'Currency' | 'Incoterm' | 'LoadType' | 'TransportType' | 'BatchQuantityRevisionType',
  id: string,
  name: string,
  onChange: any => void,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
  width: '200px',
  height: '30px',
  forceHoverStyle: false,
  value: 'Other',
};

function EnumInput({
  name,
  value,
  enumType,
  isRequired,
  width,
  height,
  forceHoverStyle,
  id,
  intl,
  onChange,
}: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });
  const itemToString = enumMessages[enumType]
    ? (enumValue: ?string | ?{ description: string, name: string }) => {
        const selectedValue = parseEnumDescriptionOrValue(enumValue);
        const messages = enumMessages[enumType];
        return messages[selectedValue]
          ? intl.formatMessage(messages[selectedValue])
          : selectedValue;
      }
    : parseEnumDescriptionOrValue;

  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        return (
          <FieldItem
            input={
              <SelectInput
                {...inputHandlers}
                name={name}
                items={data}
                itemToString={itemToString}
                itemToValue={parseEnumValue}
                inputValue={inputHandlers.value}
                renderSelect={({ ...selectProps }) => (
                  <DefaultSelect
                    {...selectProps}
                    required
                    id={`input-${id}`}
                    hasError={hasError}
                    isOpen={isFocused}
                    width={width}
                    height={height}
                    align="left"
                    forceHoverStyle={forceHoverStyle}
                  />
                )}
                renderOptions={({ ...optionProps }) => (
                  <DefaultOptions {...optionProps} items={data} width="200px" align="left" />
                )}
                onChange={(item: ?{ name: string }) => {
                  inputHandlers.onChange({
                    currentTarget: {
                      value: item && item.name,
                    },
                  });
                  onChange(item && item.name);
                }}
              />
            }
          />
        );
      }}
    </EnumProvider>
  );
}

EnumInput.defaultProps = defaultProps;

export default injectIntl(EnumInput);
