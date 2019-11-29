// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import Dialog from 'components/Dialog';
import { Display } from 'components/Form';
import messages from '../../messages';
import { BodyWrapperStyle } from './style';

type Props = {
  onDone: () => void,
};

const NoPermission = ({ onDone }: Props) => {
  const [isOpen, close] = useSheetActionDialog(onDone);

  return (
    <Dialog isOpen={isOpen} onRequestClose={close} onCancel={close} showCancelButton>
      <div className={BodyWrapperStyle}>
        <Display>
          <FormattedMessage {...messages.actionNoPermission} />
        </Display>

        <BaseButton
          label={<FormattedMessage {...messages.actionNoPermissionClose} />}
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

export default NoPermission;
