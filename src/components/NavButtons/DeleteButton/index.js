// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faDelete from '@fortawesome/fontawesome-pro-solid/faTrash';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  disabled?: boolean,
};

const DeleteButton = ({ disabled, ...rest }: Props) => (
  <CustomButton
    label={<FormattedMessage {...messages.delete} />}
    color="red"
    icon={<FontAwesomeIcon icon={faDelete} fixedWidth />}
    disabled={disabled}
    {...rest}
  />
);

DeleteButton.defaultProps = {
  disabled: false,
};

export default DeleteButton;
