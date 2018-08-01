// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCancel from '@fortawesome/fontawesome-pro-solid/faTimesCircle';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  disabled: boolean,
};

const CancelButton = ({ disabled, ...rest }: Props) => (
  <CustomButton
    label={<FormattedMessage {...messages.cancel} />}
    color="gray"
    icon={<FontAwesomeIcon icon={faCancel} fixedWidth />}
    disabled={disabled}
    {...rest}
  />
);

export default CancelButton;
