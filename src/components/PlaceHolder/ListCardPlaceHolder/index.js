// @flow

import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { colors } from 'styles/common';
import BoxContainer from '../components/BoxContainer';

type OptionalProps = {
  height: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  height: 400,
};

export default function ListCardPlaceHolder({ height }: Props) {
  return (
    <BoxContainer height={height}>
      <ContentLoader
        width={880}
        height={height}
        speed={2}
        primaryColor={colors.GRAY_SUPER_LIGHT}
        secondaryColor={colors.WHITE}
      >
        <rect x="40" y="45" rx="5" ry="5" width="195" height="210" />
        <rect x="255" y="55" rx="5" ry="5" width="195" height="210" />
        <rect x="470" y="45" rx="5" ry="5" width="195" height="210" />
      </ContentLoader>
    </BoxContainer>
  );
}

ListCardPlaceHolder.defaultProps = defaultProps;
