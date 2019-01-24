// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const TimelineDateContainersWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1.89;
`;

export const TimelineDateWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 37px 1fr 15px;
  align-items: center;
`;

export const LabelStyle: string = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15px;
  ${borderRadiuses.BUTTON};
  ${fontSizes.TINY};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
`;

export const AgreedDateStyle = (hasDate: boolean): string => css`
  color: ${hasDate ? colors.BLUE : colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
  font-weight: bold;
  ${fontSizes.SMALL};
  width: 100%;
  text-align: center;
`;

export const ActualDateStyle = (hasDate: boolean): string => css`
  color: ${hasDate ? colors.TEAL : colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
  font-weight: bold;
  ${fontSizes.SMALL};
  width: 100%;
  text-align: center;
`;

export const ApprovedIconStyle = (approved: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
  width: 15px;
  height: 15px;
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
`;
