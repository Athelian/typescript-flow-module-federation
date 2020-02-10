// @flow
import * as React from 'react';
import { convertValueToFormFieldFormat } from 'components/Form/Factories/helpers';
import {
  FieldItem,
  Label,
  FormTooltip,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps as StandardInputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';

type InputWrapperProps = StandardInputWrapperProps & {
  type?: 'standard' | 'label',
  dropDirection?: 'down' | 'up',
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    items: Array<{ value: string, label: React.Node }>,
    hideDropdownArrow: boolean,
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
  hideDropdownArrow: false,
  editable: false,
  blackout: false,
  vertical: false,
};

const SelectInputFactory = ({
  vertical,
  isTouched,
  label,
  items,
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
  hideDropdownArrow,
  editable,
  blackout,
}: Props): React.Node => {
  const itemToString = item => item?.label ?? item ?? '';
  const itemToValue = item => item?.value ?? item ?? '';

  const selectedItem = items.find(item => itemToValue(item) === value);

  const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

  const tooltipConfig = {
    isNew,
    infoMessage,
    errorMessage: isTouched && errorMessage,
    warningMessage: isTouched && warningMessage,
    changedValues: {
      oldValue: itemToString(items.find(item => itemToValue(item) === originalValue)),
      newValue: itemToString(selectedItem),
    },
  };

  const inputConfig = {
    width: inputWidth,
    height: inputHeight,
    forceHoverStyle,
    placeholder,
    required,
    hideDropdownArrow,
  };

  const optionsConfig = {
    width: inputWidth,
    dropDirection,
  };

  const selectConfig = {
    type,
    items,
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
    onBlur,
    onFocus,
    align: inputAlign,
    readOnly: !editable,
    itemToString,
    itemToValue,
    renderSelect: ({ ...rest }) => <DefaultSelect {...rest} {...inputConfig} />,
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
    renderedInput = <SelectInput {...selectConfig} />;
  }

  return (
    <FieldItem
      vertical={vertical}
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={renderedInput}
    />
  );
};

SelectInputFactory.defaultProps = defaultProps;

export default SelectInputFactory;
