// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { CardActionStyle } from 'components/Cards/BaseCard/Actions/CardAction/style';

type Props = {
  hoverColor: string,
  onClick: () => void,
};

const defaultProps = {
  hoverColor: 'BLUE',
};

const CloneButton = ({ onClick, hoverColor }: Props) => (
  <button className={CardActionStyle(hoverColor)} onClick={onClick} type="button">
    <Icon icon="CLONE" />
  </button>
);

CloneButton.defaultProps = defaultProps;

export default CloneButton;
