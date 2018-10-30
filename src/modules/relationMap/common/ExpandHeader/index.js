// @flow
import * as React from 'react';
import { ExpandStyle } from './style';

type Props = {
  isExpanding: boolean,
  onClick: () => void,
  children: React.Node,
};

export default function ExpandHeader({ children, isExpanding, onClick }: Props) {
  return (
    <div className={ExpandStyle(isExpanding)}>
      {children}
      <button type="button" onClick={onClick}>
        {isExpanding ? '<' : '>'}
      </button>
    </div>
  );
}
