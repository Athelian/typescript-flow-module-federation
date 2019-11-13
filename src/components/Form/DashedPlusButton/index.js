// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { DashedPlusButtonWrapperStyle, LabelStyle } from './style';

type Props = {|
  width: string,
  height: string,
  onClick: Function,
  label: React$Node,
|};

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
