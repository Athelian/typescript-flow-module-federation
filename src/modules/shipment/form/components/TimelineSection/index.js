// @flow
import * as React from 'react';
// import { uniqBy } from 'lodash';
// import { FormattedMessage } from 'react-intl';
// import { ShipmentExporterCard, ShipmentForwarderCard } from 'components/Cards';
// import EnumProvider from 'providers/enum';
// import Icon from 'components/Icon';
// import GridColumn from 'components/GridColumn';
// import GridRow from 'components/GridRow';
// import {
//   FieldItem,
//   Label,
//   Tooltip,
//   DefaultStyle,
//   DashedPlusButton,
//   TextInput,
//   DateInput,
//   SelectInput,
//   DefaultSelect,
//   DefaultOptions,
//   TagsInput,
// } from 'components/Form';
import { TimelineSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TimelineSection = ({ isNew }: Props) => (
  <div className={TimelineSectionWrapperStyle}>{isNew}</div>
);

export default TimelineSection;
