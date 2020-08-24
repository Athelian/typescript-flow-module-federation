// @flow
import * as React from 'react';
import DateUserDisplay from './Displays/DateUserDisplay';
import NumberDisplay from './Displays/NumberDisplay';
import DateDifferenceDisplay from './Displays/DateDifferenceDisplay';
import TextDisplay from './Displays/TextDisplay';
import DateDisplay from './Displays/DateDisplay';
import MetricValueDisplay from './Displays/MetricValueDisplay';
import MaskableMetricValueDisplay from './Displays/MaskableMetricValueDisplay';
import StatusDisplay from './Displays/StatusDisplay';
import PartnerDisplay from './Displays/PartnerDisplay';
import PartnersDisplay from './Displays/PartnersDisplay';
import DateDisplayTZ from './Displays/DateDisplayTZ';

type Props = {
  value: any,
  type: string,
  entity: {
    id: string,
    type: string,
  } | null,
  extra: any,
};

const displays = {
  number: NumberDisplay,
  text: TextDisplay,
  date: DateDisplay,
  date_tz: DateDisplayTZ,
  date_user: DateUserDisplay,
  date_difference: DateDifferenceDisplay,
  metric_value: MetricValueDisplay,
  maskable_metric_value: MaskableMetricValueDisplay,
  status: StatusDisplay,
  partner: PartnerDisplay,
  partners: PartnersDisplay,
};

const CellDisplay = ({ value, type, entity, extra }: Props) => {
  if (!displays[type]) {
    throw new Error(`Cell display type of '${type}' doesn't not exist`);
  }

  return React.createElement(displays[type], {
    value,
    entity,
    extra,
  });
};

export default CellDisplay;
