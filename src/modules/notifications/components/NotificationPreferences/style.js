// @flow
import { css } from 'react-emotion';
import { borderRadiuses, layout, shadows, colors } from 'styles/common';

export const ButtonStyle = css`
  ${borderRadiuses.MAIN};
`;

export const ModalWrapperStyle: string = css`
  ${layout.VERTICAL};
  width: 600px;
`;

export const HeaderStyle: string = css`
  ${layout.VERTICAL};
  position: sticky;
  z-index: 1;
`;

export const ActionsWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${shadows.HEADER};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  z-index: 2;
`;

export const ButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;

export const PreferenceWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${shadows.HEADER};
  background-color: ${colors.GRAY_VERY_LIGHT};
  position: sticky;
  height: 50px;
  padding: 10px 20px;
  justify-content: space-between;
`;

export const InfoTooltipStyle = css`
  font-weight: 900;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.GRAY_LIGHT};
`;

export const EmailWrapperStyle = css`
  ${layout.HORIZONTAL};
  width: 100%;
  font-weight: 900;
  font-size: 14px;
  font-size: 14px;
  line-height: 14px;
  align-items: center;
  text-align: center;
  color: #11d1a6;
`;

export const EmailPreferenceStyle = css`
  ${layout.HORIZONTAL};
  align-items: center;
  text-align: center;
  margin: 0 10px;
`;
