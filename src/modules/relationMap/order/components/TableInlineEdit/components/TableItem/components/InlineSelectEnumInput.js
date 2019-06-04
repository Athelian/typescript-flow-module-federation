// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import EnumProvider from 'providers/enum';
import { parseEnumValue, parseEnumDescriptionOrValue } from 'components/Form/Factories/helpers';
import enumMessages from 'components/Form/Factories/messages';
import { FieldItem, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/form/hooks';
import logger from 'utils/logger';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
  width: string,
  height: string,
  forceHoverStyle: boolean,
  onChange?: any => void,
  onBlur?: Function,
};

type Props = OptionalProps & {
  intl: IntlShape,
  name: string,
  value: string,
  enumType: 'Currency' | 'Incoterm' | 'LoadType' | 'TransportType' | 'BatchQuantityRevisionType',
  id: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
  width: '200px',
  height: '30px',
  forceHoverStyle: false,
};

function InlineSelectEnumInput({
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
  onBlur,
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
                afterClearSelection={() => {
                  logger.warn('afterClearSelection');
                  inputHandlers.onChange({
                    currentTarget: {
                      value: null,
                    },
                  });
                  setTimeout(() => {
                    inputHandlers.onBlur();
                    emitter.emit('INLINE_CHANGE', {
                      name,
                      hasError: !!isRequired,
                      value: '',
                    });
                    inputHandlers.onFocus();
                  }, 0);
                }}
                onBlur={() => {
                  if (onBlur) {
                    onBlur();
                  } else {
                    logger.warn('SelectInput onBlur', inputHandlers.value);
                    if (data.find(item => item.name === inputHandlers.value)) {
                      inputHandlers.onBlur();
                      emitter.emit('INLINE_CHANGE', {
                        name,
                        hasError: false,
                        value: inputHandlers.value,
                      });
                    } else {
                      inputHandlers.onChange({
                        currentTarget: {
                          value: '',
                        },
                      });
                      setTimeout(() => {
                        inputHandlers.onBlur();
                        emitter.emit('INLINE_CHANGE', {
                          name,
                          hasError: !!isRequired,
                          value: '',
                        });
                      }, 0);
                    }
                  }
                }}
                onChange={(item: ?{ name: string }) => {
                  if (onChange) {
                    inputHandlers.onChange({
                      currentTarget: {
                        value: item && item.name,
                      },
                    });
                    onChange(item && item.name);
                  } else {
                    logger.warn('SelectInput onChange', item);
                    if (!item) {
                      inputHandlers.onChange({
                        currentTarget: {
                          value: '',
                        },
                      });
                      emitter.emit('INLINE_CHANGE', {
                        name,
                        hasError: !!isRequired,
                        value: '',
                      });
                    } else {
                      inputHandlers.onChange({
                        currentTarget: {
                          value: item && item.name,
                        },
                      });
                      emitter.emit('INLINE_CHANGE', {
                        name,
                        hasError: false,
                        value: item && item.name,
                      });
                    }
                  }
                }}
              />
            }
          />
        );
      }}
    </EnumProvider>
  );
}

InlineSelectEnumInput.defaultProps = defaultProps;
export default injectIntl(InlineSelectEnumInput);
