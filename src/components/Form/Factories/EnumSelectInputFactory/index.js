// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import EnumProvider from 'providers/enum';
import {
  parseEnumDescriptionOrValue,
  convertValueToFormFieldFormat,
} from 'components/Form/Factories/helpers';
import enumMessages from 'components/Form/Factories/messages';
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
    intl: IntlShape,
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    enumType: string,
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

const EnumSelectInputFactory = ({
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
  intl,
}: Props): React.Node => {
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
        const selectedItem = data.find(item => item.name === value);

        const itemToValue = item => (item ? item.name : '');

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
          required,
          hideDropdownArrow,
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
          renderedInput = <SelectInput items={loading ? [] : data} {...selectConfig} />;
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
};

EnumSelectInputFactory.defaultProps = defaultProps;

export default injectIntl(EnumSelectInputFactory);
