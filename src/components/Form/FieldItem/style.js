// @flow
import { css } from 'react-emotion';

export const FieldItemWrapperStyle = (vertical: boolean) => css`
  position: relative;
  display: flex;
  ${!vertical && 'align-items: center; justify-content: space-between'};
  flex-direction: ${vertical ? 'column' : 'row'};
  width: 100%;
`;

export default FieldItemWrapperStyle;
