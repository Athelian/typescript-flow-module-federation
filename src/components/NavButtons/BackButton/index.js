// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBack from '@fortawesome/fontawesome-pro-regular/faArrowLeft';
import { BackButtonStyle } from './style';

type Props = {};

function BackButton(props: Props) {
  return (
    <button type="button" className={BackButtonStyle} {...props}>
      <FontAwesomeIcon icon={faBack} fixedWidth />
    </button>
  );
}

export default BackButton;
