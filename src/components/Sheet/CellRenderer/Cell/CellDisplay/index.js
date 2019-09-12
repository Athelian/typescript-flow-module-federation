// @flow
import * as React from 'react';
import DateUser from './Displays/DateUserDisplay';
import NumberDisplay from './Displays/NumberDisplay';

type Props = {
  value: any,
  type: string,
};

const displays = {
  date_user: DateUser,
  number: NumberDisplay,
};

const CellDisplay = ({ value, type }: Props) =>
  React.createElement(displays[type], {
    value,
  });

export default CellDisplay;
