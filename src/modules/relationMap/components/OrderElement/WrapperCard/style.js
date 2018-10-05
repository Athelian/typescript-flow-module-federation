import { css } from 'react-emotion';

export const OuterCardWrapperStyle = css`
  width: 100%;
  height: fit-content;
  position: relative;
  cursor: pointer;

  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
`;

export const InnerCardWrapperStyle = css`
  pointer-events: none;
`;
