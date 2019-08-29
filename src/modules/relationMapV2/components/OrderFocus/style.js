// @flow
import { css } from 'react-emotion';
import { colors, scrollbars } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  ${scrollbars.MAIN};
`;

export const ContentStyle = css`
  margin: 10px 0;
  min-width: 10px;
`;

export const ListStyle = css`
  ${scrollbars.MAIN};
`;

export const RowStyle = css`
  display: grid;
  grid-template-columns: repeat(5, min-content);
`;

export const MatchedStyle = (isMatched: boolean) => css`
  position: absolute;
  border: 4px solid ${colors.TRANSPARENT};
  background-color: ${colors.WHITE};
  z-index: -1;
  ${isMatched
    ? `
    left: -4px;
    top: -4px;
    height: calc(100% + 8px);
  width: calc(100% + 8px);
  border-radius: 9px;
  border-color: rgba(11, 110, 222, 0.5);
  `
    : `
  left: 0px;
  top: 0px;
  height: 100%;
width: 100%;
border-radius: 5px;
  `}
`;

export const ActionsBackdropStyle: string = css`
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100px;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #eee);
  pointer-events: none;
`;
