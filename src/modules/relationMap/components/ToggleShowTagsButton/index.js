// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButtonStyle, StatusStyle } from './style';

type Props = {
  isToggle: boolean,
  onToggle: Function,
};

const ToggleShowTagsButton = ({ isToggle, onToggle }: Props) => (
  <>
    <div className={StatusStyle(isToggle)}>
      <Icon icon="TAGS" />
      Tags
      <button
        type="button"
        className={ToggleButtonStyle(isToggle)}
        tabIndex={-1}
        onClick={onToggle}
      >
        {isToggle ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
      </button>
    </div>
  </>
);

export default ToggleShowTagsButton;
