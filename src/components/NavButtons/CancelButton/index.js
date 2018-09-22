// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCancel from '@fortawesome/fontawesome-pro-solid/faTimesCircle';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  onClick: Function,
};

const CancelButton = ({ ...rest }: Props) => (
  <CustomButton
    {...rest}
    label={<FormattedMessage {...messages.cancel} />}
    icon={<FontAwesomeIcon icon={faCancel} fixedWidth />}
  />
);

export default CancelButton;
