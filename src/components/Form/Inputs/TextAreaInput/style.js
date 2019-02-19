// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, scrollbars } from 'styles/common';

type TextAreaReadOnlyProps = {
  align: 'left' | 'right' | 'center',
  readOnlyWidth: string,
  readOnlyHeight: string,
};

export const TextAreaReadOnlyStyle = ({
  align,
  readOnlyWidth,
  readOnlyHeight,
}: TextAreaReadOnlyProps): string => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: ${align};
  min-width: 0;
  width: ${readOnlyWidth};
  flex: 1;
  max-width: ${readOnlyWidth};
  height: ${readOnlyHeight};
  padding: 1px 5px;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: auto;
  white-space: pre-wrap;
`;

export default TextAreaReadOnlyStyle;
