// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import { parseEnumValue, parseEnumDescriptionOrValue } from 'modules/form/factories/helpers';
import {
  FieldItem,
  Label,
  FormTooltip,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps as StandardInputWrapperProps,
  InputProps,
} from 'modules/form/factories/type';

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
    isTouched: boolean,
    label?: React.Node,
    SearchSelect: () => React.Node,
    Options: () => React.Node,
    enumType: string,
    editable?: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  SearchSelect: DefaultSearchSelect,
  Options: DefaultOptions,
};

const parseOnChangeValue = (value: ?string): { target: { value: string } } => ({
  target: {
    value: value || '',
  },
});

const EnumSelectInputFactory = ({
  isTouched,
  label,
  SearchSelect,
  Options,
  enumType,
  required,
  labelAlign,
  labelWidth,
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
}: Props): React.Node => (
  <EnumProvider enumType={enumType}>
    {({ loading, error, data }) => {
      const selectedItem = data.find(item => item.name === value);

      const itemToString = parseEnumDescriptionOrValue;
      const itemToValue = parseEnumValue;

      const labelConfig = { required, align: labelAlign, width: labelWidth };

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
            // $FlowFixMe itemToValue has some flow-type issue.
            onChange(parseOnChangeValue(itemToValue(newValue)));
          }
        },
        onBlur: () => {
          if (onBlur) {
            if (data.find(item => itemToValue(item) === value)) onBlur();
            else if (onChange) {
              // $FlowFixMe itemToValue has some flow-type issue.
              onChange(parseOnChangeValue(itemToValue(originalValue)));
              setTimeout(() => {
                onBlur();
              }, 0);
            }
          }
        },
        onFocus,
        onSearch: newQuery => {
          if (onChange) {
            onChange(parseOnChangeValue(newQuery));
          }
        },
        afterClearSelection: () => {
          if (onChange) {
            onChange(parseOnChangeValue(null));
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
        renderSelect: ({ ...rest }) => <SearchSelect {...rest} {...inputConfig} />,
        renderOptions: ({ ...rest }) => <Options {...rest} {...optionsConfig} />,
        readOnlyWidth: inputWidth,
        readOnlyHeight: inputHeight,
      };

      return (
        <FieldItem
          label={label && <Label {...labelConfig}>{label}</Label>}
          tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
          input={
            error ? (
              `Error!: ${error}`
            ) : (
              <StringValue value={itemToString(selectedItem) || value}>
                {({ value: query }) => (
                  <SearchSelectInput
                    inputValue={query}
                    items={loading ? [] : filterItems(query, data)}
                    {...selectConfig}
                  />
                )}
              </StringValue>
            )
          }
        />
      );
    }}
  </EnumProvider>
);

EnumSelectInputFactory.defaultProps = defaultProps;

export default EnumSelectInputFactory;
