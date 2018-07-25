// @flow
import React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  disabled?: boolean,
  selectable?: boolean,
  selected?: boolean,
  showActionsOnHover?: boolean,
  onClick: () => void,
};

const defaultProps = {
  disabled: false,
  selectable: false,
  selected: false,
  showActionsOnHover: false,
};

const getIcon = (disabled, selectable, selected, icon) => {
  if (disabled) return 'fasBan';
  if (selectable && selected) return 'fasCheck';
  if (selectable && !selected) return 'farCheck';
  return icon;
};

function CornerIcon({
  icon,
  color,
  disabled,
  selectable,
  selected,
  showActionsOnHover,
  onClick,
}: Props) {
  const iconToShow = getIcon(disabled, selectable, selected, icon);

  return (
    <div
      className={IconStyle(color, !!disabled, !!showActionsOnHover)}
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
