// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { RemoveButtonStyle, DashedLineStyle } from './style';

type OptionalProps = {
  offset: boolean,
};

type Props = OptionalProps & {
  onClick: Function,
};

const defaultProps = {
  offset: false,
};

export default function RemoveButton({ onClick, offset }: Props) {
  return (
    <button onClick={onClick} className={RemoveButtonStyle(Boolean(offset))} type="button">
      <div className={DashedLineStyle} />
      <Icon icon="CLEAR" />
    </button>
  );
}

RemoveButton.defaultProps = defaultProps;
