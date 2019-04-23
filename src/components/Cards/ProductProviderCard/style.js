// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, colors, presets } from 'styles/common';

export const ProductProviderCardWrapperStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 195px;
  height: 106px;
`;

export const NameStyle: string = css`
  padding: 5px 5px 0 5px;
  width: 175px;
`;

export const InfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px;
  width: 195px;
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

export const TaskWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
  padding: 0 5px;
`;
