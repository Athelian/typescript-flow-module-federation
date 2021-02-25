// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';
import { SelectedEntitiesWrapperStyle } from './style';

type Props = {
  label: string,
  onClick?: Function,
  disabled?: boolean,
};

const ButtonFloat = ({ label, onClick, disabled = false }: Props) => {
  return (
    <div className={SelectedEntitiesWrapperStyle}>
      <BaseButton
        label={label}
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        disabled={disabled}
        onClick={onClick}
        data-testid="buttonFloat"
      />
    </div>
  );
};

export default ButtonFloat;
