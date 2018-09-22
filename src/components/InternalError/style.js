// @flow
import { css } from 'react-emotion';
import { gradients, layout, transitions } from 'styles/common';

export const InternalErrorContainerStyle: string = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  background: ${gradients.BLUE_TEAL_DIAGONAL};
  justify-content: space-between;
  color: #fff;
  cursor: pointer;
`;

export const InternalErrorTitleContainerStyle: string = css`
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  user-select: none;
  flex: 3;
`;

export const InternalErrorH1Style: string = css`
  font-size: 200px;
  line-height: 250px;
  font-weight: 100;
`;

export const InternalErrorGifStyle: string = css`
  height: 300px;
`;

export const InternalErrorH3Style: string = css`
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
  padding: 20px;
  text-align: center;
`;

export const InternalErrorLinkContainerStyle: string = css`
  flex: 1;
`;

export const InternalErrorLinkStyle: string = css`
  ${layout.VERTICAL};
  ${layout.CENTER};
  ${transitions.MAIN};
  font-size: 14px;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 2px;
  color: #fff;
  text-decoration: none;
  text-shadow: none;
  &:hover {
    text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.4);
  }
`;

export const InternalErrorLogoStyle: string = css`
  width: 60px;
`;
