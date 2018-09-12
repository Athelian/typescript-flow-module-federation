// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import { CustomButton } from 'components/NavButtons';
import { SectionHeader, Label, Display } from 'components/Form';
import {
  DateSectionWrapperStyle,
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
} from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
};

const dummyAssignedTo = [
  {
    firstName: 'Kevin',
    lastName: 'Nguyen',
  },
  {
    firstName: 'Kevin',
    lastName: 'Nguyen',
  },
];

const dummyApprovedBy = {
  firstName: 'Kevin',
  lastName: 'Nguyen',
};

const dummyApprovedAt = '2018-01-01';

const DateSection = ({ isNew, icon, title }: Props) => (
  <div className={DateSectionWrapperStyle}>
    <GridColumn>
      <SectionHeader icon={icon} title={title} />

      {isNew}

      <GridRow gap="10px">
        <GridColumn gap="5px">
          <Label>ASSIGNED TO</Label>
          <div className={AssignmentWrapperStyle}>
            {dummyAssignedTo.map(assigned => (
              <div className={AssignmentStyle}>
                <button className={RemoveAssignmentButtonStyle} type="button">
                  <Icon icon="REMOVE" />
                </button>
                <UserAvatar firstName={assigned.firstName} lastName={assigned.lastName} />
              </div>
            ))}
            {dummyAssignedTo.length < 5 && (
              <button className={AddAssignmentButtonStyle} type="button">
                <Icon icon="ADD" />
              </button>
            )}
          </div>
        </GridColumn>

        <GridColumn gap="5px">
          <Label>APPROVED BY</Label>
          <div className={ApprovalWrapperStyle}>
            {dummyApprovedAt ? (
              <GridRow gap="5px">
                <UserAvatar
                  firstName={dummyApprovedBy.firstName}
                  lastName={dummyApprovedBy.lastName}
                />
                <div className={ApprovedByWrapperStyle}>
                  <div className={ApprovedByStyle}>
                    <FormattedName
                      firstName={dummyApprovedBy.firstName}
                      lastName={dummyApprovedBy.lastName}
                    />
                  </div>
                  <Display>
                    <FormattedDate value={dummyApprovedAt} />
                  </Display>
                </div>
              </GridRow>
            ) : (
              <CustomButton label="APPROVE" icon={<Icon icon="CHECKED" />} color="blue" />
            )}
          </div>
        </GridColumn>
      </GridRow>

      <GridColumn gap="10px">
        <Label>DATES</Label>
      </GridColumn>
    </GridColumn>
  </div>
);

export default DateSection;
