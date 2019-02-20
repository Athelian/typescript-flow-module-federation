// @flow
import { css } from 'react-emotion';

export const FieldItemWrapperStyle = (vertical: boolean): string => css`
  position: relative;
  display: flex;
  ${!vertical && 'align-items: center; justify-content: space-between'};
  flex-direction: ${vertical ? 'column' : 'row'};
  width: 100%;
`;

export const TooltipAbsoluteWrapperStyle: string = css`
  position: absolute;
  left: -20px;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
