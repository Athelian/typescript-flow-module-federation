// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  readOnly: boolean,
  selectable: boolean,
  selected: boolean,
  invert: boolean,
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
  invert: false,
};

const getIcon = (disabled, selectable, selected, icon) => {
  if (disabled) return 'DISABLED';
  if (selectable && selected) return 'CHECKED';
  if (selectable && !selected) return 'UNCHECKED';
  return icon;
};

// $FlowFixMe it is an open issue on flow https://github.com/facebook/flow/issues/6103
const CornerIcon = React.forwardRef(
  ({ icon, color, disabled, readOnly, selectable, selected, onClick, invert }: Props, ref) => {
    const iconToShow = getIcon(disabled, selectable, selected, icon);

    return (
      <button
        className={IconStyle(color, disabled, readOnly, invert)}
        type="button"
        onClick={onClick}
        ref={ref}
      >
        <Icon icon={iconToShow} />
      </button>
    );
  }
);

// $FlowFixMe: ignore for now until flow fix this issue with forwardRef
CornerIcon.defaultProps = defaultProps;

export default CornerIcon;
