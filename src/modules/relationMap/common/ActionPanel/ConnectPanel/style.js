import styled, { css } from 'react-emotion';
import { layout, colors, shadows } from 'styles/common';

export const PanelWrapperStyle = css`
  ${layout.LAYOUT};
  align-items: center;
  width: 100%;
  height: 50px;
  background: ${colors.GRAY_SUPER_LIGHT};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    ${shadows.HEADER};
  }
`;

export const Panel = styled('div')`
  ${PanelWrapperStyle};
`;

export const CenterPanel = styled('div')`
  ${PanelWrapperStyle} justify-content: center;
`;

export const GroupItem = css`
  display: flex;
  align-items: center;
`;

export const SubPanel = flex => css`
  flex: ${flex || 1};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  height: 100%;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    ${shadows.HEADER};
  }
`;

export const CancelPanel = flex => css`
  flex: ${flex || 1};
  display: flex;
  align-items: center;
  justify-content: center;
`;
