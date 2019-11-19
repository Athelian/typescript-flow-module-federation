// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { DateUserDisplayStyle } from './style';

const DateUserDisplay = ({
  value,
}: DisplayProps<{
  at: Date | string,
  by: {
    firstName: string,
    lastName: string,
    avatar: {
      path: string,
    } | null,
  },
}>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={cx(DisplayContentStyle, DateUserDisplayStyle)}>
      <FormattedDate value={value?.at} />
    </span>
    {value?.by && (
      <UserAvatar
        width="20px"
        height="20px"
        firstName={value?.by?.firstName ?? ''}
        lastName={value?.by?.lastName ?? ''}
        image={value?.by?.avatar?.path}
      />
    )}
  </div>
);

export default DateUserDisplay;
