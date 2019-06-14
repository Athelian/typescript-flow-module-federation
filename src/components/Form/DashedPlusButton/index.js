// @flow
import React from 'react';
import Icon from 'components/Icon';
import { DashedPlusButtonWrapperStyle, LabelStyle } from './style';

type Props = {
  width: string,
  height: string,
  label: * | null,
  onClick: Function,
};

const defaultProps = {
  width: '100px',
  height: '100px',
  label: null,
};

const DashedPlusButton = ({ width, height, onClick, label, ...rest }: Props) => (
  <button
    className={DashedPlusButtonWrapperStyle(width, height)}
    onClick={onClick}
    type="button"
    data-testid="dashedButton"
    {...rest}
  >
    <Icon icon="ADD" />
    {label && <span className={LabelStyle}>{label}</span>}
  </button>
);

DashedPlusButton.defaultProps = defaultProps;

export default DashedPlusButton;
