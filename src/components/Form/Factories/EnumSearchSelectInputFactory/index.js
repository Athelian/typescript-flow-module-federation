// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import {
  parseEnumValue,
  parseEnumDescriptionOrValue,
  convertValueToFormFieldFormat,
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
  InputWrapperProps as StandardInputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

type InputWrapperProps = StandardInputWrapperProps & {
  type?: 'standard' | 'label',
  hideClearButton?: boolean,
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    enumType: string,
    editable: boolean,
    blackout: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  labelHeight: '30px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  editable: false,
  blackout: false,
  vertical: false,
};

const EnumSearchSelectInputFactory = ({
  vertical,
  isTouched,
  label,
  enumType,
  required,
  labelAlign,
  labelWidth,
  labelHeight,
  hideTooltip,
  isNew,
  errorMessage,
  warningMessage,
  infoMessage,
  originalValue,
  type,
  hideClearButton,
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
}: Props): React.Node => (
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
        hideClearButton,
      };

      const optionsConfig = {
        width: inputWidth,
      };

      const selectConfig = {
        type,
        isFocused,
        hasError: !!(isTouched && errorMessage),
        disabled,
        value,
        name,
        onChange: newValue => {
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
            onChange(convertValueToFormFieldFormat(null));
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

EnumSearchSelectInputFactory.defaultProps = defaultProps;

export default EnumSearchSelectInputFactory;
