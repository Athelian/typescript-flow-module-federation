// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import { SectionHeader, Label, FieldItem, TextInput, DefaultStyle } from 'components/Form';
import { VoyageInfoSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
};

const VoyageInfoSection = ({ isNew, icon, title }: Props) => (
  <div className={VoyageInfoSectionWrapperStyle}>
    <GridColumn>
      <SectionHeader icon={icon} title={title} />
      <FieldItem
        label={<Label>VESSEL NAME</Label>}
        input={
          <DefaultStyle forceHoverStyle={isNew} width="200px">
            <TextInput />
          </DefaultStyle>
        }
      />
      <FieldItem
        label={<Label>VOYAGE CODE</Label>}
        input={
          <DefaultStyle forceHoverStyle={isNew} width="200px">
            <TextInput />
          </DefaultStyle>
        }
      />
    </GridColumn>
  </div>
);

export default VoyageInfoSection;
