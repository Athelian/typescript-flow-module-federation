// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import Icon from 'components/Icon';
import { UserConsumer } from 'modules/user';
import UserAvatar from 'components/UserAvatar';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import { CustomButton } from 'components/NavButtons';
import { SectionHeader, Label } from 'components/Form';
import {
  TimelineInfoSectionWrapperStyle,
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  ApprovedAtStyle,
  UnapproveButtonStyle,
} from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
  timelineDate: Object,
  sourceName: string,
  setFieldDeepValue: Function,
  removeArrayItem: Function,
};

class TimelineInfoSection extends React.PureComponent<Props> {
  handleRemoveAssignedTo = (index: number) => {
    const { sourceName, removeArrayItem } = this.props;

    removeArrayItem(`${sourceName}.assignedTo[${index}]`);
  };

  handleUnapprove = () => {
    const { timelineDate, sourceName, setFieldDeepValue } = this.props;

    const newState = { ...timelineDate, approvedAt: null, approvedBy: null };

    setFieldDeepValue(sourceName, newState);
  };

  handleApprove = (user: Object) => {
    const { timelineDate, sourceName, setFieldDeepValue } = this.props;

    const newState = { ...timelineDate, approvedAt: new Date(), approvedBy: user };

    setFieldDeepValue(sourceName, newState);
  };

  render() {
    const {
      isNew,
      icon,
      title,
      timelineDate,
      sourceName,
      setFieldDeepValue,
      removeArrayItem,
      ...rest
    } = this.props;
    return (
      <div className={TimelineInfoSectionWrapperStyle} {...rest}>
        <GridColumn>
          <SectionHeader icon={icon} title={title} />

          {isNew}

          <GridRow gap="10px">
            <GridColumn gap="5px">
              <Label>ASSIGNED TO</Label>
              <div className={AssignmentWrapperStyle}>
                {timelineDate.assignedTo.map((assigned, index) => (
                  <div className={AssignmentStyle} key={assigned.id}>
                    <button
                      className={RemoveAssignmentButtonStyle}
                      onClick={() => this.handleRemoveAssignedTo(index)}
                      type="button"
                    >
                      <Icon icon="REMOVE" />
                    </button>
                    <UserAvatar firstName={assigned.firstName} lastName={assigned.lastName} />
                  </div>
                ))}
                {timelineDate.assignedTo.length < 5 && (
                  <button className={AddAssignmentButtonStyle} type="button">
                    <Icon icon="ADD" />
                  </button>
                )}
              </div>
            </GridColumn>

            <GridColumn gap="5px">
              <Label>APPROVAL</Label>
              <div className={ApprovalWrapperStyle}>
                {timelineDate.approvedAt && timelineDate.approvedBy ? (
                  <>
                    <UserAvatar
                      firstName={timelineDate.approvedBy.firstName}
                      lastName={timelineDate.approvedBy.lastName}
                    />
                    <div className={ApprovedByWrapperStyle}>
                      <div className={ApprovedByStyle}>
                        <FormattedName
                          firstName={timelineDate.approvedBy.firstName}
                          lastName={timelineDate.approvedBy.lastName}
                        />
                      </div>
                      <div className={ApprovedAtStyle}>
                        <FormattedDate value={timelineDate.approvedAt} />
                      </div>
                    </div>
                    <button
                      className={UnapproveButtonStyle}
                      onClick={this.handleUnapprove}
                      type="button"
                    >
                      <Icon icon="CLEAR" />
                    </button>
                  </>
                ) : (
                  <UserConsumer>
                    {({ user }) => (
                      <CustomButton
                        onClick={() => this.handleApprove(user)}
                        label="APPROVE"
                        icon={<Icon icon="CHECKED" />}
                        color="blue"
                      />
                    )}
                  </UserConsumer>
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
  }
}

export default TimelineInfoSection;
