// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';
import { SelectedEntitiesWrapperStyle } from './style';

type Props = {
  label: string,
  onClick?: Function,
  disabled?: boolean,
  right?: number,
};

const ButtonFloat = ({ label, onClick, right = 50, disabled = false }: Props) => {
  return (
    <div className={SelectedEntitiesWrapperStyle(right)}>
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
