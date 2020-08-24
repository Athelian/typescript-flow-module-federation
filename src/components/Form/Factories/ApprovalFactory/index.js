// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, ApprovalInput, FieldItem } from 'components/Form';
import type { UserPayload } from 'generated/graphql';
import { type UserAvatarType } from 'types';
import { newDateUTC } from 'utils/date';
import { ApprovalWrapperStyle } from './style';

type OptionalProps = {
  approvedAtName: string,
  approvedAt: ?string,
  approvedByName: string,
  approvedBy: ?UserAvatarType,
  setFieldValue: (name: string, value: any) => void,
  approvable: boolean,
  name: string,
  handleTimezone?: boolean,
};

type Props = OptionalProps & {
  groupIds: Array<string>,
};

const defaultProps = {
  approvedAtName: '',
  approvedAt: null,
  approvedByName: '',
  approvedBy: null,
  setFieldValue: () => {},
  approvable: false,
  name: '',
};

const ApprovalFactory = ({
  name,
  approvedAtName,
  approvedAt,
  approvedByName,
  approvedBy,
  setFieldValue,
  approvable,
  groupIds,
  handleTimezone = false,
}: Props) => {
  const approvalInputConfig = {
    groupIds,
    approvedAt,
    approvedBy,
    onApprove: (user: UserPayload) => {
      setFieldValue(approvedByName, user);
      setFieldValue(approvedAtName, handleTimezone ? newDateUTC() : new Date());
    },
    onUnapprove: () => {
      setFieldValue(approvedByName, null);
      setFieldValue(approvedAtName, null);
    },
    editable: approvable,
    handleTimezone,
  };

  return (
    <div className={ApprovalWrapperStyle}>
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

ApprovalFactory.defaultProps = defaultProps;

export default ApprovalFactory;
