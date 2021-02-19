// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import GridRow from 'components/GridRow';
import type { FormDialogProps } from 'components/Dialog/type';
import { SaveButton, CancelButton } from 'components/Buttons';
import Dialog from '../index';
import { DialogStyle, ButtonContainerStyle, NoPaddingStyle } from './style';

function FormDialog({
  isOpen,
  isLoading,
  onRequestClose,
  onCancel,
  onSave,
  noPadding,
  width = '968px',
  children,
}: FormDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width={width}>
      <div className={cx(DialogStyle, { [NoPaddingStyle]: noPadding })}>
        <div className={ButtonContainerStyle}>
          <GridRow>
            <CancelButton disabled={isLoading} onClick={onCancel} />
            <SaveButton disabled={isLoading} isLoading={isLoading} onClick={onSave} />
          </GridRow>
        </div>
        {children}
      </div>
    </Dialog>
  );
}

export default FormDialog;
