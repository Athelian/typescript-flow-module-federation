// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, UserAssignmentInput } from 'components/Form';
import { type User } from 'components/Form/UserAssignmentInput';
import type { LabelProps } from 'modules/form/factories/type';

type TooltipProps = {
  hideTooltip: boolean,
  infoMessage?: React.Node,
};

type InputProps = {
  onChange: Function,
  name: string,
  values: Array<User>,
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
    values,
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
