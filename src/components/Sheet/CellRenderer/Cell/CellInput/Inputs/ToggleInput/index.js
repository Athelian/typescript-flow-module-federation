// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ToggleInput as BaseToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { ToggleInputWrapperStyle } from './style';

const ToggleInput = ({ on, off }: { on: ?React.Node, off: ?React.Node }) => ({
  value,
  onChange,
  readonly,
}: InputProps<boolean>) => (
  <div className={CellInputWrapperStyle}>
    <div className={ToggleInputWrapperStyle(!!value)}>
      <BaseToggleInput
        toggled={value}
        editable={!readonly}
        onToggle={() => {
          onChange(!value);
        }}
      />
      {value ? on : off}
    </div>
  </div>
);

export default {
  Default: ToggleInput({
    on: null,
    off: null,
  }),
  Booked: ToggleInput({
    on: <FormattedMessage id="components.sheet.booked" defaultMessage="Booked" />,
    off: <FormattedMessage id="components.sheet.unbooked" defaultMessage="Unbooked" />,
  }),
};
