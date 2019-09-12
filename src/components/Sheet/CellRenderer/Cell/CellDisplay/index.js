// @flow
import * as React from 'react';
import DateUser from './Displays/DateUser';

type Props = {
  value: any,
  type: string,
};

const displays = {
  date_user: DateUser,
};

const CellDisplay = ({ value, type }: Props) => {
  return React.createElement(displays[type], {
    value,
  });
};

export default CellDisplay;
