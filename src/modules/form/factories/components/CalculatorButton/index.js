// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { CalculatorButtonStyle } from './style';

type Props = {
  onClick?: Function,
};

const CalculatorButton = ({ ...rest }: Props): React.Node => (
  <button {...rest} className={CalculatorButtonStyle} type="button">
    <Icon icon="CALCULATOR" />
  </button>
);

export default CalculatorButton;
