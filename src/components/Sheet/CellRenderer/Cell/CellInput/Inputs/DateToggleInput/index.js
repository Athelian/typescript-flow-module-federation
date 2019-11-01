// @flow
import * as React from 'react';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import { ToggleInput } from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import {
  DateToggleInputWrapperStyle,
  DateToggleInputReadonlyWrapperStyle,
  ReadonlyWrapperStyle,
  ReadonlyDateStyle,
} from './style';

const DateToggleInput = ({
  value,
  context,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<{ value: ?Date | ?string, auto: boolean }, Date | string>) => {
  const isEnableToggle = value?.auto ?? false;
  const date = value?.value;
  const readOnlyMode = isEnableToggle || readonly;

  if (readOnlyMode) {
    return (
      <div className={DateToggleInputReadonlyWrapperStyle}>
        <div className={ReadonlyWrapperStyle}>
          <div className={ReadonlyDateStyle}>
            <FormattedDate value={context} />
          </div>
        </div>

        <InputWrapper focus={focus}>
          {({ ref }) => (
            <ToggleInput
              inputRef={ref}
              toggled={isEnableToggle}
              onToggle={() => onChange({ value: context, auto: !isEnableToggle })}
            />
          )}
        </InputWrapper>
      </div>
    );
  }

  return (
    <div className={DateToggleInputWrapperStyle}>
      <InputWrapper focus={focus} preselect>
        {({ ref }) => (
          <BaseDateInput
            inputRef={ref}
            value={date}
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            onChange={e => onChange({ ...value, value: e.target.value })}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={e => {
              if (e.key === 'Tab' && !e.shiftKey) {
                e.stopPropagation();
              } else if (onKeyDown) {
                onKeyDown(e);
              }
            }}
          />
        )}
      </InputWrapper>

      <ToggleInput
        toggled={isEnableToggle}
        onToggle={() => onChange({ value: context, auto: !isEnableToggle })}
      />
    </div>
  );
};

export default DateToggleInput;
