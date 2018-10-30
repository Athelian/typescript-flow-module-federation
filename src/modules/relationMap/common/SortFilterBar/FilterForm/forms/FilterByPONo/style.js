// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const PONoItemStyle = (selected: boolean) => css`
  height: 25px;
  line-height: 25px;
  width: 100%;
  padding: 0 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  ${fontSizes.SMALL};
  font-weight: bold;
  cursor: pointer;

  ${selected
    ? css`
        background-color: ${colors.TEAL};
        color: ${colors.WHITE};
      `
    : css`
        color: ${colors.GRAY_DARK_1};
        background-color: ${colors.WHITE};
      `};
`;

export const FilterByPONoLabel = css`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;

  > span {
    height: 20px;
    line-height: 20px;
    ${fontSizes.MEDIUM};
    color: ${colors.GRAY_LIGHT};
    letter-spacing: 3px;
  }

  > div {
    width: calc(50% - 10px);
  }
`;

export default null;
