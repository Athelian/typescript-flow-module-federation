// @flow
import * as React from 'react';
import DateUser from './Displays/DateUserDisplay';
import NumberDisplay from './Displays/NumberDisplay';
import TextDisplay from './Displays/TextDisplay';

type Props = {
  value: any,
  type: string,
};

const displays = {
  date_user: DateUser,
  number: NumberDisplay,
  text: TextDisplay,
};

const CellDisplay = ({ value, type }: Props) =>
  React.createElement(displays[type], {
    value,
  });

export default CellDisplay;
