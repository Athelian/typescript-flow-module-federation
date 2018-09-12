// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import { SectionHeader, Label } from 'components/Form';
import {
  DateSectionWrapperStyle,
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
};

const dummyAssigned = [
  {
    firstName: 'Kevin',
    lastName: 'Nguyen',
  },
  {
    firstName: 'Kevin',
    lastName: 'Nguyen',
  },
];

const DateSection = ({ isNew, icon, title }: Props) => (
  <div className={DateSectionWrapperStyle}>
    <GridColumn>
      <SectionHeader icon={icon} title={title} />
      {isNew}
      <GridColumn gap="5px">
        <Label>ASSIGNED TO</Label>
        <div className={AssignmentWrapperStyle}>
          {dummyAssigned.map(assigned => (
            <div className={AssignmentStyle}>
              <button className={RemoveAssignmentButtonStyle} type="button">
                <Icon icon="REMOVE" />
              </button>
              <UserAvatar firstName={assigned.firstName} lastName={assigned.lastName} />
            </div>
          ))}
          {dummyAssigned.length < 10 && (
            <button className={AddAssignmentButtonStyle} type="button">
              <Icon icon="ADD" />
            </button>
          )}
        </div>
      </GridColumn>
    </GridColumn>
  </div>
);

export default DateSection;
