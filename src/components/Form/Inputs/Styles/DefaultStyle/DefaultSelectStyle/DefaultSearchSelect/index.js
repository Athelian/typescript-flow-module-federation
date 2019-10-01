// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import DebounceInput from 'react-debounce-input';
import Icon from 'components/Icon';
import { type RenderSearchSelectProps } from 'components/Form/Inputs/SearchSelectInput/type';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import {
  ClearButtonStyle,
  ArrowDownStyle,
} from 'components/Form/Inputs/Styles/DefaultStyle/DefaultSelectStyle/DefaultSelect/style';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type OptionalProps = {
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
  hideClearButton: boolean,
  placeholder: ?string,
  itemToString: Function,
};

type Props = OptionalProps &
  RenderSearchSelectProps & {
    intl: IntlShape,
    hasError: boolean,
    disabled: boolean,
    forceHoverStyle: boolean,
    width: string,
    height: string,
  };

const defaultProps = {
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  align: 'left',
  hideClearButton: false,
  placeholder: null,
  itemToString: () => {},
};

function DefaultSearchSelect({
  intl,
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
  value,
  handleQueryChange,
  itemToString,
  hideClearButton,
  placeholder,
  ...rest
}: Props) {
  const inputRef = React.useRef(null);

  return (
    <div
      className={DefaultStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError,
        disabled,
        forceHoverStyle,
        width,
        height,
      })}
    >
      {align === 'right' &&
        (!hideClearButton && selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              toggle();
              if (inputRef?.current) {
                inputRef.current.focus();
              }
            }}
            className={ArrowDownStyle(isOpen)}
          >
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
      <DebounceInput
        inputRef={inputRef}
        onClick={e => {
          e.target.select();
          toggle();
        }}
        debounceTimeout={500}
        spellCheck={false}
        style={{ textAlign: align }}
        {...getInputProps({
          value: value || '',
          onChange: handleQueryChange,
          ...rest,
        })}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultSelectPlaceholder)
            : placeholder
        }
      />
      {align === 'left' &&
        (!hideClearButton && selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              toggle();
              if (inputRef?.current) {
                inputRef.current.focus();
              }
            }}
            className={ArrowDownStyle(isOpen)}
          >
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
    </div>
  );
}

DefaultSearchSelect.defaultProps = defaultProps;

export default injectIntl(DefaultSearchSelect);
