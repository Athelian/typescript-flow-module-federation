// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

const getHighlightColor = (
  isFocused: boolean,
  isTargeted: ?boolean,
  isCurrentFocused: ?boolean
) => {
  if (isTargeted) {
    return colors.TEAL;
  }
  if (isCurrentFocused) {
    return colors.HIGHLIGHT_DARK;
  }
  if (isFocused) {
    return colors.HIGHLIGHT;
  }
  return colors.GRAY_QUITE_LIGHT;
};

export const TotalCardWrapperStyle = css`
  margin-left: 1em;
`;

export const CardWrapperStyle = css`
  display: grid;
  grid-template-columns: auto 90px;
  padding: 0 25px 0 5px;
`;
export const CardTitleStyle = css`
  ${fontSizes.SMALL};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 2px;
  word-break: break-all;
`;
export const CardVisualizeStyle = css`
  width: 90px;
  height: 30px;
`;

export const ResetBaseCardStyle = css`
  box-shadow: none;
  width: auto;
  &:hover {
    box-shadow: none;
  }
`;

export const IsNewItemStyle = css`
  position: absolute;
  top: -10px;
  left: -10px;
`;

export const ItemWrapperStyle = (
  isFocused: boolean,
  isTargeted: ?boolean,
  isCurrentFocused: ?boolean
) => {
  const focused = getHighlightColor(isFocused, isTargeted, isCurrentFocused);
  return css`
    border-radius: 10px;
    border: 5px solid ${focused};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    height: fit-content;
    min-height: 50px;
    max-height: 200px;
    margin: 0 0 15px 0;
    ${fontSizes.MAIN};
    font-weight: bold;
    color: ${colors.BLACK};
    position: relative;
  `;
};

export const ShipmentCardStyle = css`
  width: 100%;
  height: 160px;
  grid-row: span 3;
  margin: 0 0 15px 0;
  min-width: 370px;
`;

export const ShipmentCardTotalStyle = css`
  margin: 0 0 15px 0;
`;
