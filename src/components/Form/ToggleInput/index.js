// @flow
import * as React from 'react';
import Icon from 'components/Icon/index';
import { ToggleButtonStyle, ToggleInputStyle } from './style';

type OptionalProps = {
  onToggle: Function,
  editable: boolean,
  align: 'left' | 'right',
  inputRef: Object,
};

type Props = OptionalProps & {
  toggled: boolean,
  children: React.Node,
};

const defaultProps = {
  editable: true,
  onToggle: () => {},
  align: 'left',
};

const ToggleInput = ({
  toggled,
  onToggle,
  align,
  children,
  editable,
  inputRef,
  ...rest
}: Props) => (
  <div className={ToggleInputStyle}>
    {align === 'left' && <>{children}</>}
    <button
      type="button"
      className={ToggleButtonStyle(toggled, editable)}
      onClick={editable ? onToggle : () => {}}
      ref={inputRef}
      {...rest}
    >
      {toggled ? <Icon icon="TOGGLE_ON" /> : <Icon icon="TOGGLE_OFF" />}
    </button>
    {align === 'right' && <>{children}</>}
  </div>
);
ToggleInput.defaultProps = defaultProps;

export default ToggleInput;
