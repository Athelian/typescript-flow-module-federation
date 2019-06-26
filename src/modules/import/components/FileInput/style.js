// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const ContainerStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
  width: 100%;
  margin: 20px 0;
`;

export const InputStyle: string = css`
  width: 0px;
  height: 0px;
  overflow: hidden;
`;

export const FilePreviewStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
  justify-content: center;
  height: 150px;
`;

export const FileIconStyle: string = css`
  font-size: 48px;
  text-align: center;
  color: ${colors.GRAY_LIGHT};
`;

export const FileNameStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: 600;
  color: ${colors.BLACK};
  margin-top: 10px;
`;
