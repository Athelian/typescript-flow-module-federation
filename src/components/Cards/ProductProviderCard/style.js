// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, colors, presets } from 'styles/common';

export const ProductProviderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 195px;
  height: 200px;
`;

export const ExporterStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  font-weight: bold;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const SupplierStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  font-weight: bold;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;
