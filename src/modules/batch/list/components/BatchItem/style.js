// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  layout,
  borderRadiuses,
  fontSizes,
  fontSizesWithHeights,
  shadows,
  transitions,
} from 'styles/common';
import { computeTextColor } from 'components/Tag/style';

export const ProductImageWrapperStyle = css`
  position: absolute;
  top: -10px;
  left: 10px;
  width: 180px;
  height: 100px;
  ${borderRadiuses.MAIN};
  ${shadows.MEDIUM};
`;

export const ImageWrapperStyle = css`
  position: relative;
  height: 100px;
  width: 180px;
`;

export const ProductInfoWrapperStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: 70px 20px 70px;
  grid-gap: 5px;
  padding: 30px 5px 2px 5px;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  border-radius: 0 0 3px 3px;
`;

export const ProductIconStyle = css`
  ${presets.BUTTON};
  color: #fff;
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  ${borderRadiuses.CIRCLE};
  &:hover {
    background-color: ${colors.TEAL_DARK};
    ${shadows.TOOLTIP};
  }
`;

const ProductInfoStyle = `
  color: #fff;
  ${fontSizesWithHeights.SMALL};
  ${presets.ELLIPSIS};
`;

export const ProductNameStyle = css`
  ${ProductInfoStyle};
`;

export const ProductSerialStyle = css`
  ${ProductInfoStyle};
  text-align: right;
`;

export const ImageStyle = css`
  ${borderRadiuses.MAIN};
  height: 100px;
  width: 180px;
  object-fit: cover;
  overflow: hidden;
  background-color: #ccc;
  user-select: none;
`;

export const BatchNoStyle = (hideImage: boolean) => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  padding: ${hideImage ? '5px' : '90px'} 10px 0 10px;
  width: 200px;
  ${presets.ELLIPSIS};
`;

export const LinksWrapperStyle = css`
  display: grid;
  grid-template-columns: 160px;
  grid-auto-rows: min-content;
  grid-gap: 5px;
  padding: 0 10px;
  width: 200px;
`;

const LinkWrapperStyle = `
  display: flex;
  align-items: center;
`;

export const OrderWrapperStyle = css`
  ${LinkWrapperStyle};
`;

export const ShipmentWrapperStyle = css`
  ${LinkWrapperStyle};
`;

export const LinkIconStyle = (isActive: boolean) => css`
  ${borderRadiuses.CIRCLE};
  ${presets.BUTTON};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  color: #fff;
  ${fontSizes.SMALL};
  ${isActive
    ? `
      background-color: ${colors.TEAL};
      &:focus {
        background-color: ${colors.TEAL_DARK};
      }
      &:hover {
        background-color: ${colors.TEAL_DARK};
        ${shadows.TOOLTIP};
      }
    `
    : `
      cursor: default;
      background-color: ${colors.GRAY_LIGHT};
    `};
`;

export const LinkValueStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  width: 160px;
  padding: 0 0 0 5px;
`;

export const InfoWrapperStyle = css`
  display: flex;
  margin: 5px 10px 0 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 180px;
`;

const SectionWrapperStyle = `
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 89.5px;
  height: 50px;
  &:not(:disabled):hover {
    & > svg {
      opacity: 1;
    }
  }
`;

const EditIconStyle = `
  position: absolute;
  top: 3px;
  opacity: 0;
  ${transitions.MAIN};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const EditDateIconStyle = css`
  ${EditIconStyle};
  right: -5px;
`;

export const QuantitySectionStyle = css`
  ${SectionWrapperStyle};
  padding: 0 10px 0 0;
`;

export const QuantityAdjustmentsTotalStyle = css`
  font-weight: bold;
  ${fontSizes.MAIN};
  text-align: center;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  width: 79.5px;
`;

export const OriginalQuantityStyle = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  text-align: center;
  ${presets.ELLIPSIS};
  width: 79.5px;
`;

export const DateSectionStyle = (hasDate: boolean) => css`
  ${SectionWrapperStyle};
  padding: 0 0 0 10px;
  ${!hasDate &&
    `&:not(:disabled):hover {
      & > span {
        opacity: 1;
      }
    }
  `};
`;

export const DateOverrideSectionStyle = css`
  ${SectionWrapperStyle};
  padding: 0 0 0 10px;
`;

export const VerticalDividerStyle = css`
  margin: 10px 0;
  width: 1px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const LabelStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
  letter-spacing: 2px;
  text-align: center;
  ${presets.ELLIPSIS};
`;

const InfoStyle = `
  width: 79.5px;
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
`;

export const DateStyle = css`
  ${InfoStyle};
  ${fontSizes.MAIN};
  cursor: text;
`;

export const DatePlaceholderStyle = css`
  ${InfoStyle};
  ${fontSizes.MAIN};
  cursor: text;
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  ${transitions.MAIN};
`;

export const DateInputStyle = css`
  ${InfoStyle};
  border: none;
  background: none;
  width: 79.5px;
  ${fontSizes.MEDIUM};
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const TaskAssignmentsWrapperStyle = css`
  display: flex;
  width: 200px;
`;

export const LatestTaskWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 5px 5px 10px;
`;

export const LatestTaskStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.CIRCLE};
  height: 25px;
  width: 25px;
  flex-shrink: 0;
  background-color: ${colors.TEAL};
  color: #fff;
  ${fontSizes.MEDIUM};
`;

export const LatestTaskDateStyle = css`
  color: ${colors.TEAL};
  ${fontSizes.SMALL};
`;

export const TaskDividerStyle = css`
  margin: 10px 0;
  width: 1px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const AssignmentsWrapperStyle = css`
  position: relative;
  display: flex;
  flex: 1;
  margin: 0 5px;
  padding: 5px;
  justify-content: center;
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  &:not(:disabled):hover {
    cursor: pointer;
    & > svg {
      opacity: 1;
    }
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const AssignmentStyle = (isNegative?: boolean) => css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.CIRCLE};
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  background-color: ${isNegative ? colors.RED_DARK : colors.GRAY_LIGHT};
  color: #fff;
  border: 2px solid ${isNegative ? colors.RED : '#fff'};
`;

export const QuantityOverlayStyle = (batchQuantity: number, assignmentQuantity: number) =>
  // const percentage =
  //   100 -
  //   ((assignmentQuantity < 0
  //     ? 0
  //     : assignmentQuantity > batchQuantity
  //       ? batchQuantity
  //       : assignmentQuantity) /
  //     batchQuantity) *
  //     100;
  css`
    position: absolute;
    left: 0;
    top: ${assignmentQuantity * 0};
    ${borderRadiuses.CIRCLE};
    height: 36px;
    width: 36px;
    flex-shrink: 0;
  `;

// background: ${
//   percentage === 0
//   ? 'rgba(13, 218, 172, 0.5)'
//   : percentage === 100
//     ? 'transparent'
//     : `linear-gradient(
//       to bottom,
//       rgba(0, 0, 0, 0) 0%,
//       rgba(0, 0, 0, 0) ${percentage - 2 < 0 ? 0 : percentage - 2}%,
//       rgba(255, 255, 255, 1) ${percentage - 2 < 0 ? 0 : percentage - 2}%,
//       rgba(255, 255, 255, 1) ${percentage + 2 > 100 ? 100 : percentage + 2}%,
//       rgba(13, 218, 172, 0.5) ${percentage + 2 > 100 ? 100 : percentage + 2}%,
//       rgba(13, 218, 172, 0.5) 100%
//     );`

export const StackedAssignmentsWrapperStyle = css`
  position: relative;
  display: flex;
  flex: 1;
  flex-shrink: 0;
`;

export const AssignmentStackedWrapperStyle = (index: number) => css`
  position: absolute;
  top: 0;
  left: ${(index + 1) * 33}px;
  z-index: ${3 - index};
`;

export const NumberOfExtraAssignmentsStyle = css`
  height: 40px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const TagsWrapperStyle = css`
  ${borderRadiuses.MAIN};
  height: 18px;
  margin: 0 10px 5px 10px;
  display: flex;
  align-items: center;
  width: 180px;
  overflow: hidden;
`;

export const TagStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.SMALL};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color};
  padding: 0 4px;
  font-weight: bold;
  margin: 0 5px 0 0;
  color: ${computeTextColor(color)};
  height: min-content;
  width: min-content;
  user-select: none;
  flex-shrink: 0;
`;

export const EyeIconStyle = css`
  position: absolute;
  top: 0;
  right: 5px;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_DARK};
  ${transitions.MAIN};
  opacity: 0;
`;
