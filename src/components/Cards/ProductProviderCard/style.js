// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, colors, presets } from 'styles/common';

export const ProductProviderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 195px;
  height: 100px;
`;

export const InfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px;
  width: 195px;
`;

export const NameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
`;

export const WrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  width: 185px;
`;

export const ExporterStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const SupplierStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;
