// @flow

import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { colors } from 'styles/common';
import { BoxContainerWrapperStyle, SectionTitleStyle } from './style';

type OptionalProps = {
  height: number,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  height: 400,
};

export default function BoxContainer({ height, children }: Props) {
  return (
    <div className={BoxContainerWrapperStyle(height)}>
      <div className={SectionTitleStyle}>
        <ContentLoader
          width={880}
          height={40}
          speed={2}
          primaryColor={colors.GRAY_VERY_LIGHT}
          secondaryColor={colors.GRAY_SUPER_LIGHT}
        >
          <rect x="10" y="10" rx="5" ry="5" width="20" height="20" />
          <rect x="40" y="10" rx="5" ry="5" width="200" height="20" />
        </ContentLoader>
      </div>
      {children}
    </div>
  );
}

BoxContainer.defaultProps = defaultProps;
