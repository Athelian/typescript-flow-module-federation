// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import EnumProvider from 'providers/enum';
import {
  parseEnumValue,
  parseEnumDescriptionOrValue,
  convertValueToFormFieldFormat,
  filterItems,
} from 'components/Form/Factories/helpers';
import {
  FieldItem,
  Label,
  FormTooltip,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';

type EnumProps = {|
  label?: React$Node,
  type?: 'standard' | 'label',
  dropDirection?: 'down' | 'up',
  hideClearButton: boolean,
  vertical: boolean,
  isTouched: boolean,
  enumType: string,
  editable: boolean,
  blackout: boolean,
|};

type Props = {|
  ...LabelProps,
  ...TooltipProps,
  ...InputWrapperProps,
  ...InputProps,
  ...EnumProps,
|};

const defaultProps = {
  labelWidth: '200px',
  labelHeight: '30px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  hideClearButton: false,
  isTouched: false,
  editable: false,
  blackout: false,
  vertical: false,
};

function EnumSearchSelectInputFactory(props: Props): React$Node {
  const {
    vertical,
    isTouched,
    label,
    enumType,
    required,
    labelAlign,
    labelWidth,
    labelHeight,
    hideTooltip,
    hideClearButton,
    isNew,
    errorMessage,
    warningMessage,
    infoMessage,
    originalValue,
    type,
    dropDirection,
    isFocused,
    disabled,
    forceHoverStyle,
    inputWidth,
    inputHeight,
    value,
    name,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    inputAlign,
    editable,
    blackout,
  } = props;
  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        const selectedItem = data.find(item => item.name === value);

        const itemToString = parseEnumDescriptionOrValue;
        const itemToValue = parseEnumValue;

        const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

        const tooltipConfig = {
          isNew,
          infoMessage,
          errorMessage: isTouched && errorMessage,
          warningMessage: isTouched && warningMessage,
          changedValues: {
            oldValue: itemToString(data.find(item => item.name === originalValue)),
            newValue: itemToString(selectedItem),
          },
        };

        const inputConfig = {
          width: inputWidth,
          height: inputHeight,
          forceHoverStyle,
          placeholder,
          hideClearButton: hideClearButton || required,
        };

        const optionsConfig = {
          width: inputWidth,
          dropDirection,
        };

        const selectConfig = {
          type,
          isFocused,
          hasError: !!(isTouched && errorMessage),
          disabled,
          value,
          name,
          onChange: newValue => {
            if (!newValue && required) {
              return;
            }

            if (onChange) {
              onChange(convertValueToFormFieldFormat(itemToValue(newValue)));
            }
          },
          onBlur: () => {
            if (onBlur) {
              if (data.find(item => itemToValue(item) === value)) onBlur();
              else if (onChange) {
                onChange(convertValueToFormFieldFormat(itemToValue(originalValue)));
                setTimeout(() => {
                  onBlur();
                }, 0);
              }
            }
          },
          onFocus,
          onSearch: newQuery => {
            if (onChange) {
              onChange(convertValueToFormFieldFormat(newQuery));
            }
          },
          afterClearSelection: () => {
            if (onChange) {
              onChange(convertValueToFormFieldFormat(''));
            }
            if (onBlur && onFocus) {
              setTimeout(() => {
                onBlur();
                onFocus();
              }, 0);
            }
          },
          align: inputAlign,
          readOnly: !editable,
          itemToString,
          itemToValue,
          renderSelect: ({ ...rest }) => <DefaultSearchSelect {...rest} {...inputConfig} />,
          renderOptions: ({ ...rest }) => <DefaultOptions {...rest} {...optionsConfig} />,
          readOnlyWidth: inputWidth,
          readOnlyHeight: inputHeight,
        };

        const blackoutConfig = {
          width: inputWidth,
          height: inputHeight,
        };

        let renderedInput = <Blackout {...blackoutConfig} />;

        if (!blackout) {
          renderedInput = (
            <StringValue value={itemToString(selectedItem) || value}>
              {({ value: query }) => (
                <SearchSelectInput
                  inputValue={query}
                  items={loading ? [] : filterItems(query, data)}
                  {...selectConfig}
                />
              )}
            </StringValue>
          );
        }

        return (
          <FieldItem
            vertical={vertical}
            label={label && <Label {...labelConfig}>{label}</Label>}
            tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
            input={error ? `Error!: ${error}` : renderedInput}
          />
        );
      }}
    </EnumProvider>
  );
}

EnumSearchSelectInputFactory.defaultProps = defaultProps;

export default EnumSearchSelectInputFactory;
