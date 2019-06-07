// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, UserAssignmentInput } from 'components/Form';
import { type UserAvatarType } from 'types';
import type { LabelProps } from 'components/Form/Factories/type';

type TooltipProps = {
  hideTooltip: boolean,
  infoMessage?: React.Node,
};

type InputProps = {
  onChange: Function,
  name: string,
  values: Array<UserAvatarType>,
  editable?: boolean,
  groupIds: Array<string>,
};

type Props = LabelProps &
  TooltipProps &
  InputProps & {
    vertical: boolean,
    label?: React.Node,
  };

const defaultProps = {
  labelHeight: '30px',
  labelWidth: '200px',
  hideTooltip: false,
  editable: true,
  vertical: true,
};

const UserAssignmentInputFactory = ({
  vertical,
  label,
  required,
  labelAlign,
  labelHeight,
  labelWidth,
  hideTooltip,
  infoMessage,
  values,
  name,
  onChange,
  editable,
  groupIds,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

  const tooltipConfig = {
    infoMessage,
  };

  const inputConfig = {
    users: values,
    name,
    onChange,
    editable,
    groupIds,
  };

  return (
    <FieldItem
      vertical={vertical}
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={<UserAssignmentInput {...inputConfig} />}
    />
  );
};

UserAssignmentInputFactory.defaultProps = defaultProps;

export default UserAssignmentInputFactory;
