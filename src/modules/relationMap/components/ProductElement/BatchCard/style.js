import styled from 'react-emotion';
import { borderRadiuses, layout, colors, fontSizes, shadows } from 'styles/common';

export const CardWrapper = styled('div')`
  ${borderRadiuses.MAIN};
  padding: 5px;
  width: 195px;
`;

export const TagWrapper = styled('div')`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
`;

export const DetailWrapper = styled('div')`
  ${layout.HORIZONTAL};
`;

export const IconWrapper = styled('div')`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 2px;
`;

export const SecondaryIconWrapper = styled('div')`
  ${borderRadiuses.CIRCLE};
  border: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_VERY_LIGHT};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 2px;
`;

export const QuantityWrapper = styled('div')`
  ${shadows.INPUT};
`;

export const Divider = styled('div')`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;
