// @flow
import * as React from 'react';
import DateUserDisplay from './Displays/DateUserDisplay';
import NumberDisplay from './Displays/NumberDisplay';
import TextDisplay from './Displays/TextDisplay';
import DateDisplay from './Displays/DateDisplay';
import MetricValueDisplay from './Displays/MetricValueDisplay';
import StatusDisplay from './Displays/StatusDisplay';
import PartnerDisplay from './Displays/PartnerDisplay';

type Props = {
  value: any,
  type: string,
  entity?: string,
};

const displays = {
  number: NumberDisplay,
  text: TextDisplay,
  date: DateDisplay,
  date_user: DateUserDisplay,
  price: MetricValueDisplay,
  status: StatusDisplay,
  partner: PartnerDisplay,
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
