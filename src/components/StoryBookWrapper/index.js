// @flow
import * as React from 'react';
import { StoryBookWrapperStyle, StoryBookWrapperContentStyle } from './style';

type OptionalProps = {
  direction: 'vertical' | 'horizontal',
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  direction: 'vertical',
};

function StoryBookWrapper({ children, direction }: Props) {
  return (
    <div className={StoryBookWrapperStyle}>
      <div className={StoryBookWrapperContentStyle(direction)}>{children}</div>
    </div>
  );
}

StoryBookWrapper.defaultProps = defaultProps;

export default StoryBookWrapper;
