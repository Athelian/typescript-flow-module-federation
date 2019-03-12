// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const CommentWrapperStyle = css`
  ${layout.HORIZONTAL};
`;

export const TimeStyle = css`
  ${fontSizes.SMALL};
  font-weight: 600;
  letter-spacing: 0.1em;
  color: ${colors.GRAY_DARK};
  padding: 2px 25px 0 0;
`;

export const ContentStyle = css`
  padding: 20px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  border-radius: 5px 0 5px 5px;
  flex: 1;
`;

export const ContentFigureStyle = css`
  position: relative;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 20px;
  height: 20px;
  overflow: hidden;

  &:before {
    position: absolute;
    content: '';
    background-color: ${colors.WHITE};
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;
