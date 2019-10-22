// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';

import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';
import { ArchivedStyle, ActiveStyle } from './style';

const StatusInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<boolean>) => {
  return (
    <InputWrapper focus={focus}>
      {({ ref }) => (
        <>
          {value ? (
            <div className={ArchivedStyle}>
              <Icon icon="ARCHIVE" />
              <FormattedMessage id="components.sheet.archived" defaultMessage="Archived" />
            </div>
          ) : (
            <div className={ActiveStyle}>
              <Icon icon="ACTIVE" />
              <FormattedMessage id="components.sheet.active" defaultMessage="Active" />
            </div>
          )}

          <ToggleInput
            inputRef={ref}
            toggled={!value}
            editable={!readonly}
            onToggle={() => {
              onChange(!value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        </>
      )}
    </InputWrapper>
  );
};

export default StatusInput;
