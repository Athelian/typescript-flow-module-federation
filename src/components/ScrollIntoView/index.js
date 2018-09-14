// @flow
import * as React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

type OptionalProps = {
  boundaryId: string,
};

type Props = OptionalProps & {
  children: React.Node,
  targetId: string,
};

const defaultProps = {
  boundaryId: null,
};

const handleClick = (targetId: string, boundaryId: string) => () => {
  const node = document.querySelector(`#${targetId}`);
  const boundaryNode = boundaryId ? document.querySelector(`#${boundaryId}`) : null;

  if (boundaryNode) {
    scrollIntoView(node, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
      boundary: boundaryNode,
    });
  } else {
    scrollIntoView(node, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
    });
  }
};

const ScrollIntoView = ({ children, targetId, boundaryId }: Props) =>
  React.cloneElement(children, {
    onClick: handleClick(targetId, boundaryId),
  });

ScrollIntoView.defaultProps = defaultProps;

export default ScrollIntoView;
