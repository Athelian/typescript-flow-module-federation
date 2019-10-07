// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, presets, colors } from 'styles/common';

export const CheckboxWrapperStyle = css`
  ${layout.HORIZONTAL};

  & > span {
    margin-left: 10px;
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
  }

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;
