// @flow
import * as React from 'react';
import LoadingIcon from 'components/LoadingIcon';
import { ActionButtonWrapperStyle, LoadingIconStyle } from './style';

type Props = {
  isDisabled?: boolean,
  isLoading?: boolean,
  onClick: Function,
  children: React.Node,
};

const defaultProps = {
  isDisabled: false,
  isLoading: false,
};

function ActionButton({ isDisabled, isLoading, onClick, children }: Props) {
  return (
    <div
      className={ActionButtonWrapperStyle(Boolean(isDisabled))}
      onClick={isDisabled ? () => {} : onClick}
      role="presentation"
    >
      {isLoading && (
        <span className={LoadingIconStyle}>
          <LoadingIcon size={25} />
        </span>
      )}

      {children}
    </div>
  );
}

ActionButton.defaultProps = defaultProps;

export default ActionButton;
