// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  readOnly: boolean,
  selectable: boolean,
  selected: boolean,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
  onClick: () => void,
};

const defaultProps = {
  disabled: false,
  readOnly: false,
  selectable: false,
  selected: false,
};

const getIcon = (disabled, selectable, selected, icon) => {
  if (disabled) return 'DISABLED';
  if (selectable && selected) return 'CHECKED';
  if (selectable && !selected) return 'UNCHECKED';
  return icon;
};

// $FlowFixMe
const CornerIcon = React.forwardRef(
  ({ icon, color, disabled, readOnly, selectable, selected, onClick }: Props, ref) => {
    const iconToShow = getIcon(disabled, selectable, selected, icon);

    return (
      <button
        className={IconStyle(color, disabled, readOnly)}
        type="button"
        onClick={onClick}
        ref={ref}
      >
        <Icon icon={iconToShow} />
      </button>
    );
  }
);

CornerIcon.defaultProps = defaultProps;

export default CornerIcon;
