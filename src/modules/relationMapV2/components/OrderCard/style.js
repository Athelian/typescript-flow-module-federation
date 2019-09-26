// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses } from 'styles/common';

export const OrderCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 285px;
  height: 55px;

  position: relative;
  > :last-child {
    opacity: 0;
  }
  &:hover > :last-child {
    opacity: 1;
  }
`;

export const TopRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 125px 125px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 5px;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  overflow: hidden;
`;

export const BottomRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 125px 125px 20px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const ItemIconsStyle = css`
  position: absolute;
  right: -10px;
  bottom: -10px;
  background: #fbaa1d;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  width: 40px;
  height: 20px;
  color: #fff;
  &:hover {
    cursor: pointer;
  }
`;
