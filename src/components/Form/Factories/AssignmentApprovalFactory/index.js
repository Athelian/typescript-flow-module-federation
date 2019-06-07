// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label, ApprovalInput, FieldItem, UserAssignmentInputFactory } from 'components/Form';
import { type UserAvatarType } from 'types';
import { AssignedAndApprovalWrapperStyle } from './style';

type OptionalProps = {
  assignmentsName: string,
  assignments: Array<UserAvatarType>,
  approvedAtName: string,
  approvedAt: ?(string | Date),
  approvedByName: string,
  approvedBy: ?UserAvatarType,
  setFieldValue: (name: string, value: any) => void,
  assignable: boolean,
  approvable: boolean,
  name: string,
};

type Props = OptionalProps & {
  groupIds: Array<string>,
};

const defaultProps = {
  assignmentsName: '',
  assignments: [],
  approvedAtName: '',
  approvedAt: null,
  approvedByName: '',
  approvedBy: null,
  setFieldValue: () => {},
  assignable: false,
  approvable: false,
  name: '',
};

const AssignmentApprovalFactory = ({
  name,
  assignmentsName,
  assignments,
  approvedAtName,
  approvedAt,
  approvedByName,
  approvedBy,
  setFieldValue,
  assignable,
  approvable,
  groupIds,
}: Props) => {
  const userAssignmentInputFactoryConfig = {
    name: assignmentsName,
    values: assignments,
    onChange: (fieldName: string, assigns: Array<Object>) => {
      setFieldValue(fieldName, assigns);
    },
    label: (
      <>
        <FormattedMessage id="components.inputs.assignedTo" defaultMessage="ASSIGNED TO" />
        {' ('}
        <FormattedNumber value={assignments.length} />
        {')'}
      </>
    ),
    editable: assignable,
  };

  const approvalInputConfig = {
    groupIds,
    approvedAt,
    approvedBy,
    onApprove: (user: UserAvatarType) => {
      setFieldValue(approvedByName, user);
      setFieldValue(approvedAtName, new Date());
    },
    onUnapprove: () => {
      setFieldValue(approvedByName, null);
      setFieldValue(approvedAtName, null);
    },
    editable: approvable,
  };

  return (
    <div className={AssignedAndApprovalWrapperStyle}>
      <UserAssignmentInputFactory {...userAssignmentInputFactoryConfig} />

      <FieldItem
        vertical
        label={
          <Label height="30px" align="right">
            <FormattedMessage id="components.inputs.approval" defaultMessage="APPROVAL" />
          </Label>
        }
        input={<ApprovalInput name={name} {...approvalInputConfig} />}
      />
    </div>
  );
};

AssignmentApprovalFactory.defaultProps = defaultProps;

export default AssignmentApprovalFactory;
