// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  readOnly: boolean,
  selectable: boolean,
  selected: boolean,
  showActionsOnHover: boolean,
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
  showActionsOnHover: false,
};

const getIcon = (disabled, selectable, selected, icon) => {
  if (disabled) return 'DISABLED';
  if (selectable && selected) return 'CHECKED';
  if (selectable && !selected) return 'UNCHECKED';
  return icon;
};

function CornerIcon({
  icon,
  color,
  disabled,
  readOnly,
  selectable,
  selected,
  showActionsOnHover,
  onClick,
}: Props) {
  const iconToShow = getIcon(disabled, selectable, selected, icon);

  return (
    <div
      className={IconStyle(color, disabled, readOnly, showActionsOnHover)}
      role="presentation"
      onClick={() => {
        if (!showActionsOnHover) onClick();
      }}
    >
      <Icon icon={iconToShow} />
    </div>
  );
}

CornerIcon.defaultProps = defaultProps;

export default CornerIcon;
