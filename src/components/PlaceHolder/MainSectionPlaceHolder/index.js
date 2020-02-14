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

export default function MainSectionPlaceholder({ height, isLoading, children }: Props) {
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
              backgroundColor={colors.GRAY_SUPER_LIGHT}
              foregroundColor={colors.WHITE}
            >
              <rect x="100" y="45" rx="5" ry="5" width="400" height="20" />
              <rect x="100" y="90" rx="5" ry="5" width="380" height="20" />
              <rect x="100" y="135" rx="5" ry="5" width="400" height="20" />
              <rect x="100" y="180" rx="5" ry="5" width="380" height="20" />
              <rect x="100" y="225" rx="5" ry="5" width="400" height="20" />
              <rect x="100" y="270" rx="5" ry="5" width="380" height="20" />
              <rect x="100" y="315" rx="5" ry="5" width="400" height="20" />

              <rect x="585" y="45" rx="5" ry="5" width="150" height="20" />
              <rect x="585" y="90" rx="5" ry="5" width="195" height="245" />
            </ContentLoader>
          </BoxContainer>
        )
      }
    </PlaceHolderWrapper>
  );
}

MainSectionPlaceholder.defaultProps = defaultProps;
