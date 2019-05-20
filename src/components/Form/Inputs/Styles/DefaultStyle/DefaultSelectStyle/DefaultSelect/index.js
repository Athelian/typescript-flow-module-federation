// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import Icon from 'components/Icon';
import { type RenderSelectProps } from 'components/Form/Inputs/SelectInput/type';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';
import { SelectInputStyle, ClearButtonStyle, ArrowDownStyle } from './style';

type OptionalProps = {
  type: 'standard' | 'label',
  required: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
  hideDropdownArrow: boolean,
  placeholder: ?string,
};

type Props = OptionalProps &
  RenderSelectProps & {
    intl: IntlShape,
    itemToString: any => string,
  };

const defaultProps = {
  type: 'standard',
  required: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  align: 'right',
  hideDropdownArrow: false,
  placeholder: null,
};

function DefaultSelect({
  intl,
  type,
  required,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  align,
  isOpen,
  clearSelection,
  toggle,
  selectedItem,
  getInputProps,
  itemToString,
  hideDropdownArrow,
  placeholder,
  ...rest
}: Props) {
  return (
    <div
      className={DefaultStyleWrapperStyle({
        type,
        isFocused: isOpen,
        hasError,
        disabled,
        forceHoverStyle,
        width,
        height,
      })}
      style={{ cursor: 'pointer' }}
    >
      {align === 'right' && !required && selectedItem && (
        <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
          <Icon icon="CLEAR" />
        </button>
      )}
      {align === 'right' && !selectedItem && !hideDropdownArrow && (
        <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
          <Icon icon="CHEVRON_DOWN" />
        </button>
      )}
      <input
        readOnly
        spellCheck={false}
        onClick={toggle}
        className={SelectInputStyle(align)}
        {...getInputProps({
          value: itemToString(selectedItem) || '',
        })}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultSelectPlaceholder)
            : placeholder
        }
        {...rest}
      />
      {align === 'left' && !required && selectedItem && (
        <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
          <Icon icon="CLEAR" />
        </button>
      )}
      {align === 'left' && !selectedItem && !hideDropdownArrow && (
        <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
          <Icon icon="CHEVRON_DOWN" />
        </button>
      )}
    </div>
  );
}

DefaultSelect.defaultProps = defaultProps;

export default injectIntl(DefaultSelect);
