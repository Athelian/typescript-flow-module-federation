// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import Dialog from 'components/Dialog';
import { Display } from 'components/Form';
import messages from '../messages';
import { BodyWrapperStyle } from './style';

const NoPermissionAction = ({ onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);

  return (
    <Dialog isOpen={isOpen} onRequestClose={close} showCancelButton>
      <div className={BodyWrapperStyle}>
        <Display>
          <FormattedMessage {...messages.noPermission} />
        </Display>

        <BaseButton
          label={<FormattedMessage {...messages.close} />}
          textColor="GRAY_DARK"
          hoverTextColor="WHITE"
          backgroundColor="GRAY_SUPER_LIGHT"
          hoverBackgroundColor="GRAY_LIGHT"
          onClick={close}
        />
      </div>
    </Dialog>
  );
};

export default NoPermissionAction;
