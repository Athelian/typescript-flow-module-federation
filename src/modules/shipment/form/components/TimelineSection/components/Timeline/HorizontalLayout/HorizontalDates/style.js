// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses } from 'styles/common';

export const HorizontalDatesWrapperStyle: string = css`
  position: relative;
  display: flex;
  width: 100%;
`;

export const SingleDateWrapperStyle: string = css`
  display: flex;
  justify-content: center;
  flex: 1;
`;

export const DoubleDatesWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const ContainerDatesContainerWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1.89;
`;

export const BlankPlaceholderStyle: string = css`
  height: 15px;
`;

export const ArrivalDepartureIconsWrapperStyle: string = css`
  position: absolute;
  left: -15px;
  top: 0;
  display: grid;
  grid-template-rows: 15px 15px;
  grid-template-columns: 15px;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
`;

export const ContainerDateWrapperStyle: string = css`
  display: flex;
  margin-bottom: 5px;
`;

export const ContainerDateLabelStyle: string = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3px;
  height: 18px;
  ${borderRadiuses.BUTTON};
  ${fontSizes.TINY};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
`;

export const ApprovalStyle = () => css`
  ${fontSizes.SMALL}
`;
