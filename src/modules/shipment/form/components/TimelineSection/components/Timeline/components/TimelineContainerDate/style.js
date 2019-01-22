// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const getTextColor = (type: 'Agreed' | 'Actual') => {
  switch (type) {
    default:
      return colors.BLACK;
    case 'Agreed':
      return colors.BLUE;
    case 'Actual':
      return colors.TEAL;
  }
};
export const ContainerDateStyle = (type: 'Agreed' | 'Actual') => css`
  color: ${getTextColor(type)};
`;

export default ContainerDateStyle;
