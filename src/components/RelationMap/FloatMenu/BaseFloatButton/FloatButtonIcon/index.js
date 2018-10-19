// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type OptionalProps = {
  disabled: boolean,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
  onClick: () => void,
};

const defaultProps = {
  disabled: false,
};

const getIcon = (disabled, icon) => {
  if (disabled) return 'DISABLED';
  return icon;
};

// $FlowFixMe
const CornerIcon = React.forwardRef(({ icon, color, disabled, onClick }: Props, ref) => {
  const iconToShow = getIcon(disabled, icon);

  return (
    <button className={IconStyle(color, disabled)} type="button" onClick={onClick} ref={ref}>
      <Icon icon={iconToShow} />
    </button>
  );
});

CornerIcon.defaultProps = defaultProps;

export default CornerIcon;
