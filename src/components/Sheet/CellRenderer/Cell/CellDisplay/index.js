// @flow
import * as React from 'react';
import DateUser from './Displays/DateUserDisplay';
import NumberDisplay from './Displays/NumberDisplay';
import TextDisplay from './Displays/TextDisplay';
import MetricValueDisplay from './Displays/MetricValueDisplay';
import StatusDisplay from './Displays/StatusDisplay';

type Props = {
  value: any,
  type: string,
  entity?: string,
};

const displays = {
  date_user: DateUser,
  number: NumberDisplay,
  text: TextDisplay,
  price: MetricValueDisplay,
  status: StatusDisplay,
};

const CellDisplay = ({ value, type, entity }: Props) => {
  if (!displays[type]) {
    throw new Error(`Cell display type of '${type}' doesn't not exist`);
  }

  return React.createElement(displays[type], {
    value,
    entity,
  });
};

export default CellDisplay;
