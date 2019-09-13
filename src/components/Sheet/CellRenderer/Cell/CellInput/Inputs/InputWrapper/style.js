// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 0 5px;
  height: 30px;

  & > input {
    width: 100%;
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    line-height: 18px;
    font-weight: 600;

    &::placeholder {
      color: ${colors.GRAY_LIGHT};
    }
  }
`;

export default WrapperStyle;
