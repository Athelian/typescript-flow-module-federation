// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const FilterMenuWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const FiltersBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
`;

export const TogglesBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  border-top: 1px solid ${colors.GRAY_VERY_LIGHT};
`;

export const RadioInputWrapperStyle: string = css`
  padding: 5px;
`;
