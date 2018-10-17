// @flow
import React from 'react';
import Icon from 'components/Icon';
import { DashedPlusButtonWrapperStyle } from './style';

type Props = {
  width: string,
  height: string,
  onClick: Function,
};

const defaultProps = {
  width: '100px',
  height: '100px',
};

const DashedPlusButton = ({ width, height, onClick, ...rest }: Props) => (
  <button
    className={DashedPlusButtonWrapperStyle(width, height)}
    onClick={onClick}
    type="button"
    {...rest}
  >
    <Icon icon="ADD" />
  </button>
);

DashedPlusButton.defaultProps = defaultProps;

export default DashedPlusButton;
