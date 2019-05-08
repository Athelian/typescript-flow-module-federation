// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import { BooleanTooltip } from 'components/Tooltip';
import { ExtraToggleButtonStyle } from './style';

type Props = {
  editable: boolean,
  toggled: boolean,
  onClick?: Function,
  toggleMessages?: {
    editable: {
      on: React.Node | string,
      off: React.Node | string,
    },
    readonly: {
      on: React.Node | string,
      off: React.Node | string,
    },
  },
};

const ExtraToggleButton = ({
  editable,
  toggled,
  onClick,
  toggleMessages,
  ...rest
}: Props): React.Node =>
  toggleMessages ? (
    <BooleanTooltip editable={editable} value={toggled} messages={toggleMessages}>
      <div className={ExtraToggleButtonStyle}>
        <ToggleInput {...rest} editable={editable} toggled={toggled} onToggle={onClick} />
      </div>
    </BooleanTooltip>
  ) : (
    <div className={ExtraToggleButtonStyle}>
      <ToggleInput {...rest} editable={editable} toggled={toggled} onToggle={onClick} />
    </div>
  );

export default ExtraToggleButton;
