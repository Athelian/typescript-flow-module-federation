import styled, { css } from 'react-emotion';
import { borderRadiuses, layout, colors, fontSizes, shadows } from 'styles/common';

const Row = css`
  padding: 5px;
`;

export const CardWrapper = styled('div')`
  ${borderRadiuses.MAIN};
  width: 195px;
`;

export const BatchRow = styled('div')`
  ${Row};
`;

export const QuantityRow = styled('div')`
  ${Row};
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const OrderRow = styled('div')`
  ${Row};
  ${layout.HORIZONTAL};
`;

export const TagWrapper = styled('div')`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
`;

export const DetailWrapper = styled('div')`
  ${layout.HORIZONTAL};
  ${Row};
`;

export const IconWrapper = styled('div')`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 3px;
  margin-right: 5px;
`;

export const SecondaryIconWrapper = styled('div')`
  ${borderRadiuses.CIRCLE};
  border: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_VERY_LIGHT};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 2px;
  margin-right: 5px;
`;

export const QuantityWrapper = styled('div')`
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const SecondaryTitle = styled('div')`
  color: ${colors.GRAY_VERY_LIGHT};
`;

export const QuantityInput = styled('div')`
  ${shadows.INPUT};
  width: 40%;
  padding: 0 5px;
`;

export const Divider = styled('div')`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 1px 10px;
`;
