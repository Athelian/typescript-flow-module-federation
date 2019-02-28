// @flow
import { css } from 'react-emotion';
import { colors, shadows, fontSizes } from 'styles/common';

export const AutofillBatchPanelWrapperStyle: string = css`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 20px;
  background-color: ${colors.TEAL_LIGHT};
  ${shadows.HEADER};
  z-index: 1;
`;

export const AutofillBatchLabelWrapperStyle: string = css`
  display: flex;
  align-items: center;
  color: ${colors.TEAL_DARK};
  ${fontSizes.SMALL};
`;
