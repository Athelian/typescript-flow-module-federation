// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import { parseEnumDescriptionOrValue } from 'modules/form/factories/helpers';
import {
  FieldItem,
  Label,
  FormTooltip,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps as StandardInputWrapperProps,
  InputProps,
} from 'modules/form/factories/type';

type InputWrapperProps = StandardInputWrapperProps & {
  type?: 'standard' | 'label',
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    isTouched: boolean,
    label?: React.Node,
    Select: () => React.Node,
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
  Select: DefaultSelect,
  Options: DefaultOptions,
  editable: true,
};

const EnumSelectInputFactory = ({
  isTouched,
  label,
  Select,
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
      const itemToValue = item => (item ? item.name : '');

      const labelConfig = { required, align: labelAlign, width: labelWidth };

      const tooltipConfig = {
        isNew,
        infoMessage,
        errorMessage: isTouched && errorMessage,
        warningMessage: isTouched && warningMessage,
        changedValues: {
          oldValue: parseEnumDescriptionOrValue(data.find(item => item.name === originalValue)),
          newValue: parseEnumDescriptionOrValue(selectedItem),
        },
      };

      const inputConfig = {
        width: inputWidth,
        height: inputHeight,
        forceHoverStyle,
        placeholder,
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
        onChange,
        onBlur,
        onFocus,
        align: inputAlign,
        readOnly: !editable,
        itemToString,
        itemToValue,
        renderSelect: ({ ...rest }) => <Select {...rest} {...inputConfig} />,
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
              <SelectInput items={loading ? [] : data} {...selectConfig} />
            )
          }
        />
      );
    }}
  </EnumProvider>
);

EnumSelectInputFactory.defaultProps = defaultProps;

export default EnumSelectInputFactory;
