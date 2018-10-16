// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { CloneButtonWrapperStyle } from './style';

type Props = {
  onClick: () => void,
};

const CloneButton = ({ onClick, ...rest }: Props) => (
  <button className={CloneButtonWrapperStyle} onClick={onClick} type="button" {...rest}>
    <Icon icon="CLONE" />
  </button>
);

export default CloneButton;
