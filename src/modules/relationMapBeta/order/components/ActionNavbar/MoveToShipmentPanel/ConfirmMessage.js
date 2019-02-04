// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { ConfirmLabelStyle } from './style';

type Props = {
  hasSelectedShipment: boolean,
};

const ConfirmMessage = ({ hasSelectedShipment }: Props) => {
  return (
    <>
      <div>
        {hasSelectedShipment && (
          <Label className={ConfirmLabelStyle} align="center">
            <FormattedMessage {...messages.confirmDeleteShipment} />
          </Label>
        )}
      </div>
      <Label className={ConfirmLabelStyle} align="center">
        <FormattedMessage {...messages.areYouSure} />
      </Label>
    </>
  );
};

export default ConfirmMessage;
