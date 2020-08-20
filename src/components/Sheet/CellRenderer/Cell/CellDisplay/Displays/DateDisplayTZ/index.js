// @flow
import * as React from 'react';
import useUser from 'hooks/useUser';
import FormattedDateTZ from 'components/FormattedDateTZ';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';

const DateDisplayTZ = ({ value }: DisplayProps<Date | string | null>) => {
  const { user } = useUser();

  return (
    <div className={CellDisplayWrapperStyle}>
      <span className={DisplayContentStyle}>
        <FormattedDateTZ value={value} user={user} />
      </span>
    </div>
  );
};

export default DateDisplayTZ;
