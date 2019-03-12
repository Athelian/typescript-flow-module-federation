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
};

type Props = LabelProps &
  TooltipProps &
  InputProps & {
    vertical: boolean,
    label?: React.Node,
  };

const defaultProps = {
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
  labelWidth,
  hideTooltip,
  infoMessage,
  values,
  name,
  onChange,
  editable,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth };

  const tooltipConfig = {
    infoMessage,
  };

  const inputConfig = {
    users: values,
    name,
    onChange,
    editable,
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
