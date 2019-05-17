// @flow

import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { colors } from 'styles/common';
import BoxContainer from '../components/BoxContainer';
import PlaceHolderWrapper from '../components/PlaceHolderWrapper';

type OptionalProps = {
  height: number,
  isLoading: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  height: 400,
  isLoading: true,
};

export default function ListCardPlaceholder({ height, isLoading, children }: Props) {
  return (
    <PlaceHolderWrapper>
      {({ isReady }) =>
        isReady && !isLoading ? (
          children
        ) : (
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
        )
      }
    </PlaceHolderWrapper>
  );
}

ListCardPlaceholder.defaultProps = defaultProps;
