// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { DeleteButtonStyle } from './style';

type Props = {|
  isHovered: boolean,
  onClick: Function,
|};

export default function MilestoneColumnHeaderCard({ isHovered, onClick }: Props) {
  return (
    <button
      className={DeleteButtonStyle(isHovered)}
      type="button"
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon icon="REMOVE" />
    </button>
  );
}
