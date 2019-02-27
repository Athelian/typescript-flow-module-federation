// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label, ApprovalInput, FieldItem, UserAssignmentInputFactory } from 'components/Form';
import { type User } from 'components/Form/UserAssignmentInput';
import { AssignedAndApprovalWrapperStyle } from './style';

type OptionalProps = {
  assignmentsName: string,
  assignments: Array<User>,
  approvedAtName: string,
  approvedAt: ?(string | Date),
  approvedByName: string,
  approvedBy: ?User,
  setFieldValue: (name: string, value: any) => void,
  editable: boolean,
  assignable: boolean,
  approvable: boolean,
};

type Props = OptionalProps & {};

const defaultProps = {
  assignmentsName: '',
  assignments: [],
  approvedAtName: '',
  approvedAt: null,
  approvedByName: '',
  approvedBy: null,
  setFieldValue: () => {},
  editable: true,
  assignable: true,
  approvable: true,
};

const AssignmentApprovalFactory = ({
  assignmentsName,
  assignments,
  approvedAtName,
  approvedAt,
  approvedByName,
  approvedBy,
  setFieldValue,
  editable,
  assignable,
  approvable,
}: Props) => {
  const userAssignmentInputFactoryConfig = {
    name: assignmentsName,
    values: assignments,
    onChange: (name: string, assigns: Array<Object>) => {
      setFieldValue(name, assigns);
    },
    label: (
      <>
        <FormattedMessage id="components.inputs.assignedTo" defaultMessage="ASSIGNED TO" />
        {' ('}
        <FormattedNumber value={assignments.length} />
        {')'}
      </>
    ),
    editable: assignable || editable,
  };

  const approvalInputConfig = {
    approvedAt,
    approvedBy,
    onApprove: (user: User) => {
      setFieldValue(approvedByName, user);
      setFieldValue(approvedAtName, new Date());
    },
    onUnapprove: () => {
      setFieldValue(approvedByName, null);
      setFieldValue(approvedAtName, null);
    },
    editable: approvable || editable,
  };

  return (
    <div className={AssignedAndApprovalWrapperStyle}>
      <UserAssignmentInputFactory {...userAssignmentInputFactoryConfig} />

      <FieldItem
        vertical
        label={
          <Label align="right">
            <FormattedMessage id="components.inputs.approval" defaultMessage="APPROVAL" />
          </Label>
        }
        input={<ApprovalInput {...approvalInputConfig} />}
      />
    </div>
  );
};

AssignmentApprovalFactory.defaultProps = defaultProps;

export default AssignmentApprovalFactory;
