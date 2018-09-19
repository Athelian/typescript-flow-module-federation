// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import GridColumn from 'components/GridColumn';
import Icon from 'components/Icon';
import NewButton from 'components/NavButtons/NewButton';
import { injectUid } from 'utils/id';
import { UserConsumer } from 'modules/user';
import UserAvatar from 'components/UserAvatar';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import { CustomButton } from 'components/NavButtons';
import { FormContainer, FormField } from 'modules/form';
import {
  SectionHeader,
  Label,
  DefaultAdjustmentStyle,
  DefaultStyle,
  DateInput,
  FieldItem,
} from 'components/Form';
import {
  TimelineInfoSectionWrapperStyle,
  AssignedAndApprovalWrapperStyle,
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  ApprovedAtStyle,
  UnapproveButtonStyle,
  AddDateButtonWrapperStyle,
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
        <GridColumn gap="10px">
          <SectionHeader icon={icon} title={title} />
          <div className={AssignedAndApprovalWrapperStyle}>
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
              <Label align="right">APPROVAL</Label>
              <div className={ApprovalWrapperStyle}>
                {timelineDate.approvedAt && timelineDate.approvedBy ? (
                  <>
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
                    <UserAvatar
                      firstName={timelineDate.approvedBy.firstName}
                      lastName={timelineDate.approvedBy.lastName}
                    />
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
          </div>

          <Subscribe to={[FormContainer]}>
            {({ state: { activeField }, ...formHelper }) => (
              <GridColumn gap="10px">
                {/* <Label>DATES</Label> */}
                <div className={AddDateButtonWrapperStyle}>
                  <NewButton
                    title="NEW DATE"
                    onClick={() => {
                      setFieldDeepValue(
                        `${sourceName}.timelineDateRevisions[${
                          timelineDate.timelineDateRevisions.length
                        }]`,
                        injectUid({
                          isNew: true,
                          type: 'Other',
                          date: '',
                          memo: '',
                          updatedAt: new Date(),
                        })
                      );
                      formHelper.setFieldTouched(
                        `${sourceName}.timelineDateRevisions[${
                          timelineDate.timelineDateRevisions.length
                        }]`
                      );
                    }}
                  />
                </div>
                {timelineDate.timelineDateRevisions &&
                  timelineDate.timelineDateRevisions.reverse().map(
                    (adjustment, index) =>
                      adjustment && (
                        <DefaultAdjustmentStyle
                          isNew={isNew}
                          index={index}
                          adjustment={adjustment}
                          key={adjustment.id}
                          setFieldArrayValue={setFieldDeepValue}
                          removeArrayItem={removeArrayItem}
                          formHelper={formHelper}
                          values={timelineDate}
                          activeField={activeField}
                          enumType="TimelineDateRevisionType"
                          targetName={`${sourceName}.timelineDateRevisions`}
                          typeName="type"
                          memoName="memo"
                          valueInput={
                            <FormField
                              name={`${sourceName}.timelineDateRevisions.${index}.date`}
                              initValue={adjustment.date}
                              setFieldValue={setFieldDeepValue}
                              {...formHelper}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DefaultStyle
                                  type="date"
                                  isFocused={activeField === name}
                                  forceHoverStyle={isNew}
                                  width="200px"
                                >
                                  <DateInput name={name} {...inputHandlers} />
                                </DefaultStyle>
                              )}
                            </FormField>
                          }
                        />
                      )
                  )}
                <FieldItem
                  label={<Label>INITIAL DATE</Label>}
                  input={
                    <FormField
                      name={`${sourceName}.date`}
                      initValue={timelineDate.date}
                      setFieldValue={setFieldDeepValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DefaultStyle
                          type="date"
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <DateInput name={name} {...inputHandlers} />
                        </DefaultStyle>
                      )}
                    </FormField>
                  }
                />
              </GridColumn>
            )}
          </Subscribe>
        </GridColumn>
      </div>
    );
  }
}

export default TimelineInfoSection;
