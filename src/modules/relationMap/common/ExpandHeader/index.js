// @flow
import * as React from 'react';
import { ExpandStyle, ExpandButtonStyle } from './style';

type Props = {
  isExpanding: boolean,
  onClick: () => void,
  children: React.Node,
};

export default function ExpandHeader({ children, isExpanding, onClick }: Props) {
  return (
    <div className={ExpandStyle(isExpanding)}>
      {children}
      <button className={ExpandButtonStyle} type="button" onClick={onClick}>
        {isExpanding ? '<' : '>'}
      </button>
    </div>
  );
}
