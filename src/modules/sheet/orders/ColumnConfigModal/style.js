// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export const ColumnConfigModalWrapperStyle: string = css`
  position: relative;
  display: flex;
`;

export const EntityBlocksWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const EntityBlockWrapperStyle: string = css`
  display: flex;
`;

export const ColorStripStyle = (color: string): string => css`
  width: 4px;
  background-color: ${colors[color]};
  flex-shrink: 0;
`;

export const IconAndButtonsWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const EntityIconStyle = (color: string): string => css`
  position: sticky;
  top: -100px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 170px;
  height: 150px;
  color: ${colors[color]};
  font-size: 64px;
  opacity: 0.5;
`;

export const FieldsWrapperStyle: string = css`
  padding: 40px 0;
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;

export const DummyColumnsPlaceholderStyle: string = css`
  width: 260px;
  height: 1000px;
  background: repeating-linear-gradient(0deg, #eee, #eee 30px, #fff 30px, #fff 40px);
`;

export const SaveResetWrapperStyle: string = css`
  position: sticky;
  top: -100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  width: 170px;
  padding: 20px 0;
  justify-items: center;
  & > button {
    width: 100px;
  }
`;

export const GroupDefaultWrapperStyle: string = css`
  position: sticky;
  top: calc(100% - 30px);
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  height: min-content;
  width: 170px;
  padding: 40px 0 20px 0;
  justify-items: center;
  background: linear-gradient(to bottom, ${colors.TRANSPARENT}, ${colors.WHITE} 20%);
  & > button {
    width: 100px;
  }
`;
