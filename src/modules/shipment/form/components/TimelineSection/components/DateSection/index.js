// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import { SectionHeader } from 'components/Form';
import { DateSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
};

const DateSection = ({ isNew, icon, title }: Props) => (
  <div className={DateSectionWrapperStyle}>
    <GridColumn>
      <SectionHeader icon={icon} title={title} />
      {isNew}
    </GridColumn>
  </div>
);

export default DateSection;
