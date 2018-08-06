// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faToggleOn from '@fortawesome/fontawesome-pro-regular/faToggleOn';
import faToggleOff from '@fortawesome/fontawesome-pro-regular/faToggleOff';
import {
  LogoWrapperStyle,
  LogoButtonWrapperStyle,
  IconStyle,
  LogoStyle,
  ToggleButtonStyle,
} from './style';
import iconWhite from './media/icon_white.png';
import logoWhite from './media/logo_white.png';

type Props = { isSideBarExpanded: boolean, toggleSideBarExpansion: Function };

const Logo = ({ isSideBarExpanded, toggleSideBarExpansion }: Props) => (
  <div className={LogoWrapperStyle}>
    <Link to="/" className={LogoButtonWrapperStyle}>
      <div className={IconStyle}>
        <img src={iconWhite} alt="brand logo" />
      </div>
      <div className={LogoStyle}>
        <img src={logoWhite} alt="brand name logo" />
      </div>
    </Link>
    <button
      type="button"
      className={ToggleButtonStyle}
      tabIndex={-1}
      onClick={toggleSideBarExpansion}
    >
      {isSideBarExpanded ? (
        <FontAwesomeIcon icon={faToggleOn} fixedWidth />
      ) : (
        <FontAwesomeIcon icon={faToggleOff} fixedWidth />
      )}
    </button>
  </div>
);

export default Logo;
