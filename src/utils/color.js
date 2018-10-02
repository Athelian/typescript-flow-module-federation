// @flow
import { colors } from 'styles/common';

export const computeTextColor = (color: string) => {
  const hex = color.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return colors.BLACK;
  }

  const red = parseInt(result[1], 16);
  const green = parseInt(result[2], 16);
  const blue = parseInt(result[3], 16);

  return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? colors.BLACK : '#ffffff';
};

export default computeTextColor;
